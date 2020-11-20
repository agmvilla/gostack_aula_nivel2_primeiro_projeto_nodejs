import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async create(userData: ICreateUserDTO): Promise<User> {
        const newUser = new User();

        Object.assign(newUser, userData, { id: uuid() });

        this.users.push(newUser);
        // const user = this.ormRepository.create(userData);

        // await this.ormRepository.save(user);

        return newUser;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        this.users[findIndex] = user;

        return user;
    }

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(usr => usr.id === id);

        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(usr => usr.email === email);

        return findUser;
    }
}

export default FakeUsersRepository;
