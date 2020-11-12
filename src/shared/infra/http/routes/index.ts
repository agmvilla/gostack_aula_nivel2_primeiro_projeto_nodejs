// src/routes/index.ts
import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointment.routes';
import usersRouter from '@modules/users/infra/http/routes/users.route';
import sessionRouter from '@modules/users/infra/http/routes/session.route';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/session', sessionRouter);

export default routes;
