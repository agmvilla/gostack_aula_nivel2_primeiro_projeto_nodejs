import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../service/CreateUserService';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import UpdateUserAvatarService from '../service/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateAvatar = new UpdateUserAvatarService();

        const user = await updateAvatar.execute({
            userId: request.user.id,
            filename: request.file.filename,
        });

        return response.json(user);
    },
);

export default usersRouter;
