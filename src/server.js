import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getContactById, getContacts } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
    );
  
    app.use((req, res, next) => { console.log(`Time:${new Date().toLocaleString()}`); next(); });
    app.get('/', (req, res) => { res.json({ message: 'Hello World - как-то так' }); });
    app.get('/contacts', async (req, res) => {
         try {
            const contacts = await getContacts();
            res.status(200).json({ data: contacts, message: "Successfully found contacts!" });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contacts', error: error.message });
        }
    });
  app.get('/contacts/:id', async (req, res) => {
        try {
            const contact = await getContactById(req.params.id);
            if (!contact) {
                return res.status(404).json({ message: `Contact with id ${req.params.id} not found` });
            }
            res.status(200).json({ data: contact, message:`Successfully found contact with id ${req.params.id}` });
          
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contact', error: error.message });
        }
    });
  app.use('*', (req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    });
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
};
// mongodb+srv://mishynk:hh65ovckRVz8OtsF@cluster0.tgrsice.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0