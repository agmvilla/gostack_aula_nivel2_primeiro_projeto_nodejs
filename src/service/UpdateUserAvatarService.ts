import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../error/AppError';

interface Request {
    userId: string;
    filename: string;
}

export default class UpdateUserAvatarService {
    public async execute({ userId, filename }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(userId);

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

        await usersRepository.save(user);

        delete user.password;

        return user;
    }
}
