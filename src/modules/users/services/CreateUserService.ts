import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepositories';

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
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new AppError('Email already used');
        }

        const hashedPassword = await hash(password, 8);

        const newUser = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        delete newUser.password;

        return newUser;
    }
}
