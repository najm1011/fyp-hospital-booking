package com.hospitalapp.backend.dto.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CancelAppointmentRequest {

    @NotBlank(message = "Cancellation reason is required")
    @Size(min = 5, max = 500, message = "Cancellation reason must be between 5 and 500 characters")
    private String reason;

    public CancelAppointmentRequest() {
    }

    public CancelAppointmentRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
