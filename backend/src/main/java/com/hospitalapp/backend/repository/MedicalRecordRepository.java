package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientIdOrderByUploadedAtDesc(Long patientId);

    Optional<MedicalRecord> findByIdAndPatientId(Long id, Long patientId);

    long countByPatientId(Long patientId);
}
