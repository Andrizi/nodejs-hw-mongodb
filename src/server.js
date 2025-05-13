import cors from 'cors';
import express from 'express';
import pino from 'pino-http';
import dotenv from 'dotenv';

import { getAllContactsController } from './controllers/contacts.controller.js';
import { getContactByIdController } from './controllers/contact.controller.js';
import { getAllContacts, getContactsById } from './services/contacts.js';

dotenv.config();

function setupServer() {
  const app = express();
  const PORT = Number(process.env.PORT);

  app.use(cors());
  app.use(express.json());
  app.use(pino());

  app.use((err, req, res, next) => {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Hello, World' });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });
  app.get('/contacts', getAllContactsController);

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });
  app.get('/contacts/:contactId', getContactByIdController);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT || 3000, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server started on port ${PORT}`);
  });
}

export default setupServer;
