import mongoose from 'mongoose';

import { env } from '../utils/env.js';
export const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    const dbName = mongoose.connection.name;
    
    // Теперь вы можете использовать переменную contactsCollection для выполнения операций с этой коллекцией
    // Например, выполните поиск всех элементов в коллекции
    

    console.log(`Successfully connected to MongoDB database: ${dbName}`);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
// mongodb+srv://mishynk:hh65ovckRVz8OtsF@cluster0.tgrsice.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0