import AppError from '@shared/error/AppError';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import AuthenticationService from '@modules/users/services/AuthenticationService';

describe('Authenticate User', () => {
    it('should be able to authenticate user', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        const authenticationService = new AuthenticationService(
            fakeUserRepository,
            fakeHashProvider,
        );

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
        const fakeUserRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticationService = new AuthenticationService(
            fakeUserRepository,
            fakeHashProvider,
        );

        expect(
            authenticationService.execute({
                email: 'test_user@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate user with invalid password', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        const authenticationService = new AuthenticationService(
            fakeUserRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'test_user',
            email: 'test_user@gmail.com',
            password: '123456',
        });

        expect(
            authenticationService.execute({
                email: 'test_user@gmail.com',
                password: '654654',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
