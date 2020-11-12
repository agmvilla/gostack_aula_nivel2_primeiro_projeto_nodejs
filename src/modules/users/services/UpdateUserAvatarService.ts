import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepositories';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/error/AppError';

interface IRequest {
    userId: string;
    filename: string;
}

@injectable()
export default class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ userId, filename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError('Only authenticated users can change avatar');
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            try {
                const avatarFileExists = await fs.promises.stat(
                    userAvatarFilePath,
                );
                if (avatarFileExists) {
                    await fs.promises.unlink(userAvatarFilePath);
                }
            } catch {}
        }

        user.avatar = filename;

        await this.usersRepository.save(user);

        return user;
    }
}
