import { MongoClient, Db } from 'mongodb';

const uri = "mongodb+srv://devgabriel:projeto1@cluster0.bhbkzzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "Cluster0";

let client: MongoClient;
let db: Db;

export async function connectDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Conectado ao MongoDB Atlas');
  }
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Banco de dados não conectado. Chame connectDb() antes.');
  }
  return db;
}