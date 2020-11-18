import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepositories';
import AppError from '@shared/error/AppError';
import CreateAppointmentService from './CreateAppointmentService';

describe('Create Appointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '1231231231',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1231231231');
    });

    it('should not be able to create a new appointment on the same date', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const appointmentDate = new Date(2020, 0, 10, 11);

        const appointment = await createAppointment.execute({
            date: appointmentDate,
            provider_id: '321321321',
        });

        expect(
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
