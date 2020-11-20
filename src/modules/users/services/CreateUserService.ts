import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new AppError('Email already used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const newUser = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return newUser;
    }
}
