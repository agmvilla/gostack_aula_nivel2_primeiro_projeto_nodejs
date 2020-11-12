import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { compare } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';

import authConfig from '@config/auth';
import AppError from '@shared/error/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepositories';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
export default class AuthenticationService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User/email does not match!', 401);
        }

        const pwdMatch = await compare(password, user.password);

        if (!pwdMatch) {
            throw new AppError('User/email does not match!', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}
