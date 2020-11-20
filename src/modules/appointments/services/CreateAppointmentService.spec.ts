import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepositories';
import AppError from '@shared/error/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('Create Appointment', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '1231231231',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1231231231');
    });

    it('should not be able to create a new appointment on the same date', async () => {
        const appointmentDate = new Date(2020, 0, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '321321321',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '64565464',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // it('should not be able to create a new appointment on the same date', () => {
    //     expect(2 + 1).toBe(3);
    // });
});
