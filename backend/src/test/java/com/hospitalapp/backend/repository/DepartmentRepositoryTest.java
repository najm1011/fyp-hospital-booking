package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Department;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Department Repository CRUD Tests")
class DepartmentRepositoryTest {

    @Autowired
    private DepartmentRepository departmentRepository;

    private Department cardiology;
    private Department dermatology;
    private Department neurology;

    @BeforeEach
    void setUp() {
        departmentRepository.deleteAll();

        cardiology = new Department();
        cardiology.setName("Cardiology");
        cardiology.setDescription("Heart and cardiovascular system diagnosis and treatment");

        dermatology = new Department();
        dermatology.setName("Dermatology");
        dermatology.setDescription("Skin, hair, and nail conditions treatment");

        neurology = new Department();
        neurology.setName("Neurology");
        neurology.setDescription("Brain, spinal cord, and nervous system disorders");
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("Should create a new department")
    void shouldCreateDepartment() {
        Department saved = departmentRepository.save(cardiology);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Cardiology");
        assertThat(saved.getDescription()).isEqualTo("Heart and cardiovascular system diagnosis and treatment");
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should create multiple departments")
    void shouldCreateMultipleDepartments() {
        departmentRepository.save(cardiology);
        departmentRepository.save(dermatology);
        departmentRepository.save(neurology);

        List<Department> departments = departmentRepository.findAll();

        assertThat(departments).hasSize(3);
    }

    // ==================== READ TESTS ====================

    @Test
    @DisplayName("Should find department by ID")
    void shouldFindDepartmentById() {
        Department saved = departmentRepository.save(cardiology);

        Optional<Department> found = departmentRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Cardiology");
    }

    @Test
    @DisplayName("Should find department by name")
    void shouldFindDepartmentByName() {
        departmentRepository.save(cardiology);

        Optional<Department> found = departmentRepository.findByName("Cardiology");

        assertThat(found).isPresent();
        assertThat(found.get().getDescription()).contains("cardiovascular");
    }

    @Test
    @DisplayName("Should return empty when department not found by name")
    void shouldReturnEmptyWhenNotFoundByName() {
        Optional<Department> found = departmentRepository.findByName("NonExistent");

        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should check if department name exists")
    void shouldCheckIfNameExists() {
        departmentRepository.save(cardiology);

        boolean exists = departmentRepository.existsByName("Cardiology");
        boolean notExists = departmentRepository.existsByName("Oncology");

        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should find all departments ordered by name")
    void shouldFindAllOrderedByName() {
        departmentRepository.save(neurology);
        departmentRepository.save(cardiology);
        departmentRepository.save(dermatology);

        List<Department> departments = departmentRepository.findAllOrderedByName();

        assertThat(departments).hasSize(3);
        assertThat(departments.get(0).getName()).isEqualTo("Cardiology");
        assertThat(departments.get(1).getName()).isEqualTo("Dermatology");
        assertThat(departments.get(2).getName()).isEqualTo("Neurology");
    }

    @Test
    @DisplayName("Should search departments by name or description")
    void shouldSearchDepartments() {
        departmentRepository.save(cardiology);
        departmentRepository.save(dermatology);
        departmentRepository.save(neurology);

        List<Department> results = departmentRepository.searchDepartments("heart");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getName()).isEqualTo("Cardiology");
    }

    @Test
    @DisplayName("Should search departments case-insensitive")
    void shouldSearchDepartmentsCaseInsensitive() {
        departmentRepository.save(cardiology);

        List<Department> results = departmentRepository.searchDepartments("CARDIOLOGY");

        assertThat(results).hasSize(1);
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("Should update department name")
    void shouldUpdateDepartmentName() {
        Department saved = departmentRepository.save(cardiology);

        saved.setName("Cardiovascular Medicine");
        Department updated = departmentRepository.save(saved);

        assertThat(updated.getName()).isEqualTo("Cardiovascular Medicine");
        assertThat(updated.getId()).isEqualTo(saved.getId());
    }

    @Test
    @DisplayName("Should update department description")
    void shouldUpdateDepartmentDescription() {
        Department saved = departmentRepository.save(cardiology);

        saved.setDescription("Updated description for heart department");
        Department updated = departmentRepository.save(saved);

        assertThat(updated.getDescription()).isEqualTo("Updated description for heart department");
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("Should delete department by ID")
    void shouldDeleteDepartmentById() {
        Department saved = departmentRepository.save(cardiology);
        Long id = saved.getId();

        departmentRepository.deleteById(id);

        Optional<Department> deleted = departmentRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete department entity")
    void shouldDeleteDepartmentEntity() {
        Department saved = departmentRepository.save(cardiology);

        departmentRepository.delete(saved);

        Optional<Department> deleted = departmentRepository.findById(saved.getId());
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete all departments")
    void shouldDeleteAllDepartments() {
        departmentRepository.save(cardiology);
        departmentRepository.save(dermatology);
        departmentRepository.save(neurology);

        departmentRepository.deleteAll();

        List<Department> departments = departmentRepository.findAll();
        assertThat(departments).isEmpty();
    }

    // ==================== COUNT TESTS ====================

    @Test
    @DisplayName("Should count total departments")
    void shouldCountTotalDepartments() {
        departmentRepository.save(cardiology);
        departmentRepository.save(dermatology);

        long count = departmentRepository.count();

        assertThat(count).isEqualTo(2);
    }
}
