import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateAvatar = container.resolve(UpdateUserAvatarService);

        const user = await updateAvatar.execute({
            userId: request.user.id,
            filename: request.file.filename,
        });

        return response.json(user);
    }
}
