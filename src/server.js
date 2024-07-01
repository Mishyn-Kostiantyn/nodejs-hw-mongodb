import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

import { HttpError } from 'http-errors';
import rootRouter from './routers/index.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import {swaggerDocs}  from './middleware/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
};
export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
export const setupServer = () => {
    const app = express();
  app.use(cors());
  app.use(cookieParser());
    app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
    );
  app.use(express.json());
    app.use((req, res, next) => { console.log(`Time:${new Date().toLocaleString()}`); next(); });
  app.get('/', (req, res) => { res.json({ message: 'Hello World - как-то так' }); });
  app.use('/uploads', express.static(UPLOAD_DIR));
   app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
    app.use(rootRouter);
  app.use('*', (req, res) => {
        res.status(404).json({ message: 'Not found' });
  });
    app.use('*', notFoundHandler);

  app.use(errorHandler);
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
 
};

// mongodb+srv://mishynk:hh65ovckRVz8OtsF@cluster0.tgrsice.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0