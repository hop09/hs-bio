import { Db, MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI ?? "";
const dbName = process.env.MONGODB_DB || "hsbio";

if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

function createClient() {
  return new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10_000,
  }).connect();
}

export const clientPromise =
  globalForMongo.mongoClientPromise ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}

export async function getDatabase(): Promise<Db> {
  return (await clientPromise).db(dbName);
}
