package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<Doctor> findByDepartmentId(Long departmentId);

    @Query("SELECT d FROM Doctor d WHERE d.department.id = :departmentId AND d.user.isActive = true")
    List<Doctor> findActiveDoctorsByDepartmentId(@Param("departmentId") Long departmentId);

    @Query("SELECT d FROM Doctor d WHERE d.department.id = :departmentId AND d.hospital.id = :hospitalId AND d.user.isActive = true")
    List<Doctor> findActiveDoctorsByDepartmentIdAndHospitalId(@Param("departmentId") Long departmentId, @Param("hospitalId") Long hospitalId);

    @Query("SELECT d FROM Doctor d WHERE d.user.isActive = true ORDER BY d.createdAt DESC")
    List<Doctor> findAllActiveDoctors();

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.user.isActive = true")
    long countAllActiveDoctors();

    @Query("SELECT COUNT(DISTINCT d.department.id) FROM Doctor d WHERE d.user.isActive = true")
    long countAllActiveDepartments();

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user WHERE d.id = :id")
    Optional<Doctor> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department WHERE d.id = :id")
    Optional<Doctor> findByIdWithUserAndDepartment(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d WHERE d.specialty LIKE %:specialty% AND d.user.isActive = true")
    List<Doctor> findBySpecialtyContaining(@Param("specialty") String specialty);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.specialty) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND d.user.isActive = true")
    List<Doctor> searchDoctors(@Param("searchTerm") String searchTerm);

    @Query("SELECT d FROM Doctor d WHERE d.department.id = :departmentId AND " +
           "(LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.specialty) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND d.user.isActive = true")
    List<Doctor> searchDoctorsByDepartment(@Param("departmentId") Long departmentId,
                                           @Param("searchTerm") String searchTerm);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = 'SCHEDULED'")
    long countUpcomingAppointments(@Param("doctorId") Long doctorId);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = 'COMPLETED'")
    long countCompletedAppointments(@Param("doctorId") Long doctorId);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.timeSlots WHERE d.id = :id")
    Optional<Doctor> findByIdWithTimeSlots(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d WHERE d.hospital.id = :hospitalId AND d.user.isActive = true ORDER BY d.createdAt DESC")
    List<Doctor> findByHospitalIdAndUserIsActiveTrue(@Param("hospitalId") Long hospitalId);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department LEFT JOIN FETCH d.hospital WHERE d.id = :id")
    Optional<Doctor> findByIdWithUserAndDepartmentAndHospital(@Param("id") Long id);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department LEFT JOIN FETCH d.hospital")
    List<Doctor> findAllWithAssociations();
}
