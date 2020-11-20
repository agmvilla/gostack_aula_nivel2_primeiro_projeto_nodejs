import AppError from '@shared/error/AppError';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import AuthenticationService from '@modules/users/services/AuthenticationService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticationService: AuthenticationService;

describe('Authenticate User', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        authenticationService = new AuthenticationService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate user', async () => {
        const user = await createUser.execute({
            name: 'test_user',
            email: 'test_user@gmail.com',
            password: '123456',
        });

        const response = await authenticationService.execute({
            email: 'test_user@gmail.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate inexistent user', async () => {
        await expect(
            authenticationService.execute({
                email: 'test_user@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate user with invalid password', async () => {
        await createUser.execute({
            name: 'test_user',
            email: 'test_user@gmail.com',
            password: '123456',
        });

        await expect(
            authenticationService.execute({
                email: 'test_user@gmail.com',
                password: '654654',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
