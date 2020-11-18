import AppError from '@shared/error/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update the avatar', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFilename: 'avatarFile.jpg',
        });

        expect(user.avatar).toBe('avatarFile.jpg');
    });

    it('should not be able to update avatar from non existent user', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatar.execute({
                userId: 'id-desconhecido',
                avatarFilename: 'avatarFile.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete old avatar when updating a new one', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFilename: 'avatarFile.jpg',
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFilename: 'avatarFile2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatarFile.jpg');
        expect(user.avatar).toBe('avatarFile2.jpg');
    });
});
