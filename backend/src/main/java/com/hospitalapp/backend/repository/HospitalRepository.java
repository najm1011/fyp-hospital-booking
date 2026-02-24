package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByOdsCode(String odsCode);

    boolean existsByOdsCode(String odsCode);

    List<Hospital> findByNameContainingIgnoreCase(String name);

    List<Hospital> findByPostcodeStartingWithIgnoreCase(String postcode);

    List<Hospital> findByCityIgnoreCase(String city);

    @Query("SELECT h FROM Hospital h WHERE h.active = true ORDER BY h.name ASC")
    List<Hospital> findAllActive();

    @Query("SELECT h FROM Hospital h WHERE h.active = true AND " +
           "(LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.postcode) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Hospital> searchHospitals(@Param("query") String query);

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.hospital.id = :hospitalId AND d.user.isActive = true")
    long countActiveDoctorsByHospitalId(@Param("hospitalId") Long hospitalId);

    @Query("SELECT COUNT(DISTINCT d.department.id) FROM Doctor d WHERE d.hospital.id = :hospitalId AND d.user.isActive = true")
    long countDepartmentsByHospitalId(@Param("hospitalId") Long hospitalId);
}
