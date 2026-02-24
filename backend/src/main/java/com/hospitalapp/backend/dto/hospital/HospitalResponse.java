package com.hospitalapp.backend.dto.hospital;

import com.hospitalapp.backend.model.Hospital;

public class HospitalResponse {

    private Long id;
    private String odsCode;
    private String name;
    private String address1;
    private String address2;
    private String city;
    private String county;
    private String postcode;
    private String phone;
    private String email;
    private String website;
    private boolean active;
    private long doctorCount;
    private long departmentCount;

    public HospitalResponse() {
    }

    public static HospitalResponse fromEntity(Hospital hospital) {
        HospitalResponse response = new HospitalResponse();
        response.setId(hospital.getId());
        response.setOdsCode(hospital.getOdsCode());
        response.setName(hospital.getName());
        response.setAddress1(hospital.getAddress1());
        response.setAddress2(hospital.getAddress2());
        response.setCity(hospital.getCity());
        response.setCounty(hospital.getCounty());
        response.setPostcode(hospital.getPostcode());
        response.setPhone(hospital.getPhone());
        response.setEmail(hospital.getEmail());
        response.setWebsite(hospital.getWebsite());
        response.setActive(hospital.isActive());
        return response;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOdsCode() {
        return odsCode;
    }

    public void setOdsCode(String odsCode) {
        this.odsCode = odsCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public long getDoctorCount() {
        return doctorCount;
    }

    public void setDoctorCount(long doctorCount) {
        this.doctorCount = doctorCount;
    }

    public long getDepartmentCount() {
        return departmentCount;
    }

    public void setDepartmentCount(long departmentCount) {
        this.departmentCount = departmentCount;
    }
}
