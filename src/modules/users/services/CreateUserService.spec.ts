import AppError from '@shared/error/AppError';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('Create User', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const newUser = await createUser.execute({
            name: 'test_user',
            email: 'test_user@gmail.com',
            password: '123456',
        });

        expect(newUser).toHaveProperty('id');
        expect(newUser.name).toBe('test_user');
        expect(newUser.email).toBe('test_user@gmail.com');
    });

    it('should not be able to create a new user with duplicated email', async () => {
        await createUser.execute({
            name: 'test_user',
            email: 'test_user@gmail.com',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'test_user',
                email: 'test_user@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
