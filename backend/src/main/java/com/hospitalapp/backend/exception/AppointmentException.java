package com.hospitalapp.backend.exception;

public class AppointmentException extends RuntimeException {

    private final String errorCode;

    public AppointmentException(String message) {
        super(message);
        this.errorCode = "APPOINTMENT_ERROR";
    }

    public AppointmentException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    // Common appointment error codes
    public static final String SLOT_NOT_AVAILABLE = "SLOT_NOT_AVAILABLE";
    public static final String INVALID_DATE = "INVALID_DATE";
    public static final String PAST_DATE = "PAST_DATE";
    public static final String TOO_FAR_IN_FUTURE = "TOO_FAR_IN_FUTURE";
    public static final String MAX_APPOINTMENTS_REACHED = "MAX_APPOINTMENTS_REACHED";
    public static final String ALREADY_CANCELLED = "ALREADY_CANCELLED";
    public static final String CANNOT_CANCEL = "CANNOT_CANCEL";
    public static final String CANNOT_MODIFY = "CANNOT_MODIFY";
    public static final String DOCTOR_NOT_AVAILABLE = "DOCTOR_NOT_AVAILABLE";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";

    // Double booking prevention error codes
    public static final String DOUBLE_BOOKING = "DOUBLE_BOOKING";
    public static final String PATIENT_TIME_CONFLICT = "PATIENT_TIME_CONFLICT";
    public static final String DOCTOR_TIME_CONFLICT = "DOCTOR_TIME_CONFLICT";
    public static final String SAME_DAY_SAME_DOCTOR = "SAME_DAY_SAME_DOCTOR";
    public static final String INVALID_TIME_SLOT = "INVALID_TIME_SLOT";
    public static final String OUTSIDE_WORKING_HOURS = "OUTSIDE_WORKING_HOURS";
}
