import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
    userId: string;
}

@injectable()
export default class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ userId }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError('Email already used');
        }

        return user;
    }
}
