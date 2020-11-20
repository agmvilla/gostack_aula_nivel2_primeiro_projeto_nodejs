import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/error/AppError';

let fakeUserRepository: FakeUsersRepository;
let showUserProfile: ShowProfileService;

describe('ShowUserProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        showUserProfile = new ShowProfileService(fakeUserRepository);
    });

    it('should be able show user profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const userProfile = await showUserProfile.execute({
            userId: user.id,
        });

        expect(userProfile.name).toBe('John Doe');
        expect(userProfile.email).toBe('johndoe@example.com');
    });

    it('should not be able to show proile from non existing user', async () => {
        await expect(
            showUserProfile.execute({
                userId: 'non-existing-user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
