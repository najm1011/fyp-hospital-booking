package com.hospitalapp.backend.dto.doctor;

import com.hospitalapp.backend.model.Doctor;

import java.math.BigDecimal;

public class DoctorResponse {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Long departmentId;
    private String departmentName;
    private String specialty;
    private String qualifications;
    private String bio;
    private String photoUrl;
    private BigDecimal consultationFee;
    private boolean isActive;
    private Long hospitalId;
    private String hospitalName;

    public DoctorResponse() {
    }

    public static DoctorResponse fromEntity(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setUserId(doctor.getUser().getId());
        response.setFirstName(doctor.getUser().getFirstName());
        response.setLastName(doctor.getUser().getLastName());
        response.setFullName(doctor.getUser().getFullName());
        response.setEmail(doctor.getUser().getEmail());
        response.setPhoneNumber(doctor.getUser().getPhoneNumber());
        response.setDepartmentId(doctor.getDepartment().getId());
        response.setDepartmentName(doctor.getDepartment().getName());
        response.setSpecialty(doctor.getSpecialty());
        response.setQualifications(doctor.getQualifications());
        response.setBio(doctor.getBio());
        response.setPhotoUrl(doctor.getPhotoUrl());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setActive(doctor.getUser().getIsActive());
        if (doctor.getHospital() != null) {
            response.setHospitalId(doctor.getHospital().getId());
            response.setHospitalName(doctor.getHospital().getName());
        }
        return response;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }
}
