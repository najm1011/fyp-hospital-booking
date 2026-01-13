package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT d FROM Department d ORDER BY d.name ASC")
    List<Department> findAllOrderedByName();

    @Query("SELECT d FROM Department d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Department> searchDepartments(@Param("searchTerm") String searchTerm);

    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.doctors WHERE d.id = :id")
    Optional<Department> findByIdWithDoctors(@Param("id") Long id);

    @Query("SELECT d FROM Department d WHERE SIZE(d.doctors) > 0 ORDER BY d.name")
    List<Department> findDepartmentsWithDoctors();

    @Query("SELECT COUNT(doc) FROM Doctor doc WHERE doc.department.id = :departmentId")
    long countDoctorsByDepartmentId(@Param("departmentId") Long departmentId);
}
