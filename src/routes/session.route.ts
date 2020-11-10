import { Router } from 'express';
import AuthenticationService from '../service/AuthenticationService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    const authentication = new AuthenticationService();

    const { user, token } = await authentication.execute({
        email,
        password,
    });

    delete user.password;

    return response.json({ user, token });
});

export default sessionRouter;
