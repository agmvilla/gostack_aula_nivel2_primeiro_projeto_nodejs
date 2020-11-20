import AppError from '@shared/error/AppError';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fake/FakeUserTokensRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ForgotPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset user password', async () => {
        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUsersRepository.create({
            name: 'test_user',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);
        await resetPasswordService.execute({
            token,
            password: '123123',
        });

        const newUserPassword = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toBeCalledWith('123123');
        expect(newUserPassword?.password).toBe(
            await fakeHashProvider.generateHash('123123'),
        );
    });

    it('should not be able to reset password with non existing token', async () => {
        const user = await fakeUsersRepository.create({
            name: 'test_user',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            resetPasswordService.execute({
                token: 'this is a token',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with non existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'fake_user_id',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change password after 2 hrs from password reset request', async () => {
        const user = await fakeUsersRepository.create({
            name: 'test_user',
            email: 'johndoe@example.com',
            password: '123456',
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
