// src/routes/index.ts
import { Router } from 'express';
import appointmentsRouter from './appointment.routes';
import usersRouter from './users.route';
import sessionRouter from './session.route';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/session', sessionRouter);

export default routes;
