package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByStatus(Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "ORDER BY a.appointmentDate DESC, a.startTime DESC")
    List<Appointment> findByPatientIdOrderedByDate(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "ORDER BY a.appointmentDate DESC, a.startTime DESC")
    List<Appointment> findByDoctorIdOrderedByDate(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status = :status " +
           "ORDER BY a.appointmentDate DESC, a.startTime DESC")
    List<Appointment> findByPatientIdAndStatus(@Param("patientId") Long patientId,
                                                @Param("status") Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = :status " +
           "ORDER BY a.appointmentDate DESC, a.startTime DESC")
    List<Appointment> findByDoctorIdAndStatus(@Param("doctorId") Long doctorId,
                                               @Param("status") Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date ORDER BY a.startTime")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId,
                                            @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate " +
           "ORDER BY a.appointmentDate, a.startTime")
    List<Appointment> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.status = 'SCHEDULED' AND a.appointmentDate >= :currentDate " +
           "ORDER BY a.appointmentDate, a.startTime")
    List<Appointment> findUpcomingAppointmentsByPatient(@Param("patientId") Long patientId,
                                                         @Param("currentDate") LocalDate currentDate);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.status = 'SCHEDULED' AND a.appointmentDate >= :currentDate " +
           "ORDER BY a.appointmentDate, a.startTime")
    List<Appointment> findUpcomingAppointmentsByDoctor(@Param("doctorId") Long doctorId,
                                                        @Param("currentDate") LocalDate currentDate);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date AND a.status = 'SCHEDULED' " +
           "ORDER BY a.startTime")
    List<Appointment> findTodayAppointmentsByDoctor(@Param("doctorId") Long doctorId,
                                                     @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date AND a.startTime = :time AND a.status = 'SCHEDULED'")
    Optional<Appointment> findByDoctorDateAndTime(@Param("doctorId") Long doctorId,
                                                   @Param("date") LocalDate date,
                                                   @Param("time") LocalTime time);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date " +
           "AND a.startTime = :startTime AND a.status = 'SCHEDULED'")
    boolean existsByDoctorDateAndTime(@Param("doctorId") Long doctorId,
                                       @Param("date") LocalDate date,
                                       @Param("startTime") LocalTime startTime);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.status = 'SCHEDULED' AND a.appointmentDate >= :currentDate")
    long countUpcomingAppointmentsByPatient(@Param("patientId") Long patientId,
                                             @Param("currentDate") LocalDate currentDate);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor WHERE a.id = :id")
    Optional<Appointment> findByIdWithPatientAndDoctor(@Param("id") Long id);

    @Query("SELECT a FROM Appointment a WHERE a.status = 'SCHEDULED' " +
           "AND a.appointmentDate >= :currentDate ORDER BY a.appointmentDate, a.startTime")
    List<Appointment> findAllUpcomingAppointments(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate " +
           "ORDER BY a.appointmentDate, a.startTime")
    List<Appointment> findAppointmentsBetweenDates(@Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countByStatus(@Param("status") Appointment.Status status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date")
    long countByAppointmentDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    long countByAppointmentDateBetween(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date AND a.status = :status")
    long countByAppointmentDateAndStatus(@Param("date") LocalDate date,
                                          @Param("status") Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.createdAt BETWEEN :startDateTime AND :endDateTime " +
           "ORDER BY a.createdAt DESC")
    List<Appointment> findAppointmentsCreatedBetween(@Param("startDateTime") LocalDateTime startDateTime,
                                                      @Param("endDateTime") LocalDateTime endDateTime);

    // --- DOUBLE BOOKING PREVENTION ---

    /**
     * Check if patient already has an appointment at the same date and time (with any doctor)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.patient.id = :patientId AND a.appointmentDate = :date " +
           "AND a.startTime = :startTime AND a.status = 'SCHEDULED'")
    boolean existsByPatientDateAndTime(@Param("patientId") Long patientId,
                                        @Param("date") LocalDate date,
                                        @Param("startTime") LocalTime startTime);

    /**
     * Check if patient has overlapping appointment (time range overlap)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.patient.id = :patientId AND a.appointmentDate = :date " +
           "AND a.status = 'SCHEDULED' " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    boolean hasOverlappingPatientAppointment(@Param("patientId") Long patientId,
                                              @Param("date") LocalDate date,
                                              @Param("startTime") LocalTime startTime,
                                              @Param("endTime") LocalTime endTime);

    /**
     * Check if doctor has overlapping appointment (time range overlap)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date " +
           "AND a.status = 'SCHEDULED' " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    boolean hasOverlappingDoctorAppointment(@Param("doctorId") Long doctorId,
                                             @Param("date") LocalDate date,
                                             @Param("startTime") LocalTime startTime,
                                             @Param("endTime") LocalTime endTime);

    /**
     * Check if patient already has an appointment with same doctor on same day
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.patient.id = :patientId AND a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date AND a.status = 'SCHEDULED'")
    boolean existsByPatientDoctorAndDate(@Param("patientId") Long patientId,
                                          @Param("doctorId") Long doctorId,
                                          @Param("date") LocalDate date);

    /**
     * Check if patient has overlapping appointment, excluding a specific appointment (for rescheduling)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.patient.id = :patientId AND a.appointmentDate = :date " +
           "AND a.status = 'SCHEDULED' AND a.id != :excludeAppointmentId " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    boolean hasOverlappingPatientAppointmentExcluding(@Param("patientId") Long patientId,
                                                       @Param("date") LocalDate date,
                                                       @Param("startTime") LocalTime startTime,
                                                       @Param("endTime") LocalTime endTime,
                                                       @Param("excludeAppointmentId") Long excludeAppointmentId);

    // --- REMINDER QUERIES ---

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor d JOIN FETCH d.department " +
           "WHERE a.appointmentDate = :date AND a.status = 'SCHEDULED' AND a.reminderSent = false")
    List<Appointment> findAppointmentsNeedingReminder(@Param("date") LocalDate date);

    // --- ANALYTICS QUERIES ---

    /**
     * Count appointments by year and month
     */
    @Query(value = "SELECT EXTRACT(YEAR FROM a.appointment_date), EXTRACT(MONTH FROM a.appointment_date), COUNT(*) " +
           "FROM appointments a " +
           "WHERE a.appointment_date BETWEEN :startDate AND :endDate " +
           "GROUP BY EXTRACT(YEAR FROM a.appointment_date), EXTRACT(MONTH FROM a.appointment_date) " +
           "ORDER BY EXTRACT(YEAR FROM a.appointment_date), EXTRACT(MONTH FROM a.appointment_date)",
           nativeQuery = true)
    List<Object[]> countAppointmentsByMonth(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    /**
     * Count appointments by year, month and status
     */
    @Query(value = "SELECT EXTRACT(YEAR FROM a.appointment_date), EXTRACT(MONTH FROM a.appointment_date), a.status, COUNT(*) " +
           "FROM appointments a " +
           "WHERE a.appointment_date BETWEEN :startDate AND :endDate " +
           "GROUP BY EXTRACT(YEAR FROM a.appointment_date), EXTRACT(MONTH FROM a.appointment_date), a.status " +
           "ORDER BY EXTRACT(YEAR FROM a.appointment_date), EXTRACT(MONTH FROM a.appointment_date)",
           nativeQuery = true)
    List<Object[]> countAppointmentsByMonthAndStatus(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);

    /**
     * Count appointments by department
     */
    @Query("SELECT d.name, COUNT(a) FROM Appointment a " +
           "JOIN a.doctor doc JOIN doc.department d " +
           "WHERE a.appointmentDate BETWEEN :startDate AND :endDate " +
           "GROUP BY d.name ORDER BY COUNT(a) DESC")
    List<Object[]> countAppointmentsByDepartment(@Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    /**
     * Count appointments by day of week
     */
    @Query(value = "SELECT EXTRACT(DOW FROM a.appointment_date) + 1, COUNT(*) FROM appointments a " +
           "WHERE a.appointment_date BETWEEN :startDate AND :endDate " +
           "GROUP BY EXTRACT(DOW FROM a.appointment_date) " +
           "ORDER BY EXTRACT(DOW FROM a.appointment_date)",
           nativeQuery = true)
    List<Object[]> countAppointmentsByDayOfWeek(@Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    /**
     * Count unique patients in date range
     */
    @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a " +
           "WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    long countUniquePatients(@Param("startDate") LocalDate startDate,
                             @Param("endDate") LocalDate endDate);

    /**
     * Count unique doctors in date range
     */
    @Query("SELECT COUNT(DISTINCT a.doctor.id) FROM Appointment a " +
           "WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    long countUniqueDoctors(@Param("startDate") LocalDate startDate,
                            @Param("endDate") LocalDate endDate);

    /**
     * Count appointments by status in date range
     */
    @Query("SELECT a.status, COUNT(a) FROM Appointment a " +
           "WHERE a.appointmentDate BETWEEN :startDate AND :endDate " +
           "GROUP BY a.status")
    List<Object[]> countByStatusInRange(@Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
}
