import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from '@shared/infra/http/routes';
import cors from 'cors';

import '@shared/infra/typeorm';
import uploadConfig from '@config/upload';
import AppError from '@shared/error/AppError';

import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

app.get('/', (request, response) =>
    response.json({ message: 'Hello UMarket' }),
);

app.listen(3333, () => {
    console.log('🚀 Server started @port 3333');
});
