import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/error/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateProfileService;

describe('UpdateUserProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateUserProfile = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update user profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserProfile.execute({
            userId: user.id,
            name: 'John New',
            email: 'test@example.com',
        });

        const updatedUser = await fakeUserRepository.findById(user.id);

        expect(updatedUser?.name).toBe('John New');
        expect(updatedUser?.email).toBe('test@example.com');
    });

    it('should not be able to change to another user email', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const userToUpdate = await fakeUserRepository.create({
            name: 'User to Update',
            email: 'to_update@example.com',
            password: '123456',
        });

        await expect(
            updateUserProfile.execute({
                userId: userToUpdate.id,
                name: 'John New',
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to change password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateUserProfile.execute({
            userId: user.id,
            name: 'John New',
            email: 'johndoe@example.com',
            oldPassword: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update password without old password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            updateUserProfile.execute({
                userId: user.id,
                name: 'John New',
                email: 'johndoe@example.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password with wrong old password', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            updateUserProfile.execute({
                userId: user.id,
                name: 'John New',
                email: 'johndoe@example.com',
                oldPassword: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password of non existing user', async () => {
        await expect(
            updateUserProfile.execute({
                userId: 'invalid-user-id',
                name: 'John New',
                email: 'johndoe@example.com',
                oldPassword: '654654',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
