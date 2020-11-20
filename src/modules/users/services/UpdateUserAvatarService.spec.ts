import AppError from '@shared/error/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to update the avatar', async () => {
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
        await expect(
            updateUserAvatar.execute({
                userId: 'id-desconhecido',
                avatarFilename: 'avatarFile.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete old avatar when updating a new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
