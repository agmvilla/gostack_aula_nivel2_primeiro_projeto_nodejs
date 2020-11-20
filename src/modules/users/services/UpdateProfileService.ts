import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';
// import AppError from '@shared/error/AppError';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
export default class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        userId,
        name,
        email,
        oldPassword,
        password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError('Usuário não encontrado');
        }

        const userToUpdate = await this.usersRepository.findByEmail(email);
        if (userToUpdate && userToUpdate.id !== userId) {
            throw new AppError('Email already in use!');
        }

        if (password && !oldPassword) {
            throw new AppError(
                'You must inform the old password to update to a new one',
            );
        }

        if (password && oldPassword) {
            const oldPasswordValid = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );

            if (!oldPasswordValid) {
                throw new AppError('Old password does not match');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        user.name = name;
        user.email = email;

        return this.usersRepository.save(user);
    }
}
