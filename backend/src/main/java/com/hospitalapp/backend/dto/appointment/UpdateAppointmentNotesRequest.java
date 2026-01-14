package com.hospitalapp.backend.dto.appointment;

import jakarta.validation.constraints.Size;

public class UpdateAppointmentNotesRequest {

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    public UpdateAppointmentNotesRequest() {
    }

    public UpdateAppointmentNotesRequest(String notes) {
        this.notes = notes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
