import 'reflect-metadata';

import express, { response } from 'express';
// src/server.ts
import routes from './routes';
// import appointmentsRouter from './routes/appointment.routes';

import './database';

const app = express();

app.use(express.json());
app.use(routes);
app.get('/', (request, response) =>
    response.json({ message: 'Hello UMarket' }),
);

app.listen(3333, () => {
    console.log('🚀 Server started @port 3333');
});
