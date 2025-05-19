import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = async () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'aplication/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());

  app.use(pino());

  app.get('/', (req, res) => {
    res.send('Welcome to the Contacts API!');
  });

  app.use('/contacts', contactsRouter);

  app.use(errorHandler);

  app.use(notFoundHandler);

  app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
