package com.hospitalapp.backend.dto.appointment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateStatusRequest {

    public enum StatusUpdate {
        COMPLETED,
        NO_SHOW
    }

    @NotNull(message = "Status is required")
    private StatusUpdate status;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(StatusUpdate status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public StatusUpdate getStatus() {
        return status;
    }

    public void setStatus(StatusUpdate status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
