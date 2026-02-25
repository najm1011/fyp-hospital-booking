package com.hospitalapp.backend.service;

import com.hospitalapp.backend.model.Appointment;
import com.hospitalapp.backend.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentReminderService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentReminderService.class);

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    public AppointmentReminderService(AppointmentRepository appointmentRepository,
                                       EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
    }

    /**
     * Runs every hour — finds tomorrow's appointments and sends reminder emails.
     * Marks each appointment as reminded so duplicates are never sent.
     */
    @Scheduled(cron = "0 0 * * * *") // every hour at minute 0
    @Transactional
    public void sendReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appointment> appointments = appointmentRepository.findAppointmentsNeedingReminder(tomorrow);

        if (appointments.isEmpty()) {
            logger.debug("No appointment reminders to send for {}", tomorrow);
            return;
        }

        logger.info("Sending {} appointment reminder(s) for {}", appointments.size(), tomorrow);

        for (Appointment appointment : appointments) {
            try {
                String patientEmail = appointment.getPatient().getEmail();
                String patientName = appointment.getPatient().getFullName();
                String doctorName = appointment.getDoctor().getDoctorName();
                String department = appointment.getDoctor().getDepartment().getName();

                emailService.sendAppointmentReminder(
                        patientEmail,
                        patientName,
                        doctorName,
                        department,
                        appointment.getAppointmentDate(),
                        appointment.getStartTime()
                );

                appointment.setReminderSent(true);
                appointmentRepository.save(appointment);

                logger.info("Reminder sent to {} for appointment on {} at {}",
                        patientEmail, appointment.getAppointmentDate(), appointment.getStartTime());
            } catch (Exception e) {
                logger.error("Failed to send reminder for appointment {}: {}",
                        appointment.getId(), e.getMessage());
            }
        }
    }
}
