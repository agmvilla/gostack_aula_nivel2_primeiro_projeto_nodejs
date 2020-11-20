import AppError from '@shared/error/AppError';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fake/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fake/FakeMailProvider';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('ForgotPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeMailProvider = new FakeMailProvider();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should be able to recover password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'test_user',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should be able to recover password from non-existing user ', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'test_user',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
