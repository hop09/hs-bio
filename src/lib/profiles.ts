import { ObjectId, type Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { sampleProfiles } from "@/lib/sample-data";
import type { BioProfile } from "@/lib/types";

const COLLECTION = "profiles";

function serialize(doc: Document): BioProfile {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  } as BioProfile;
}

export async function ensureSampleProfiles() {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION);
  await collection.createIndex({ slug: 1 }, { unique: true });
  if ((await collection.countDocuments()) === 0) {
    const now = new Date();
    await collection.insertMany(
      sampleProfiles.map((profile) => {
        const data = { ...profile };
        delete data._id;
        return { ...data, createdAt: now, updatedAt: now };
      }) as Document[],
    );
  }
}

export async function getPublishedProfile(slug: string) {
  await ensureSampleProfiles();
  const doc = await (await getDatabase())
    .collection(COLLECTION)
    .findOne({ slug: slug.toLowerCase(), published: true });
  return doc ? serialize(doc) : null;
}

export async function getProfileBySlug(slug: string) {
  await ensureSampleProfiles();
  const doc = await (await getDatabase())
    .collection(COLLECTION)
    .findOne({ slug: slug.toLowerCase() });
  return doc ? serialize(doc) : null;
}

export async function listProfiles() {
  await ensureSampleProfiles();
  const docs = await (await getDatabase())
    .collection(COLLECTION)
    .find()
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function saveProfile(profile: BioProfile) {
  const db = await getDatabase();
  const now = new Date();
  const { _id } = profile;
  const payload: Document = { ...profile };
  delete payload._id;
  delete payload.createdAt;
  delete payload.updatedAt;
  if (_id) {
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...payload, updatedAt: now } },
    );
    return _id;
  }
  const result = await db.collection(COLLECTION).insertOne({
    ...payload,
    slug: payload.slug.toLowerCase(),
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId.toString();
}

export async function deleteProfile(id: string) {
  await (await getDatabase())
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
}
