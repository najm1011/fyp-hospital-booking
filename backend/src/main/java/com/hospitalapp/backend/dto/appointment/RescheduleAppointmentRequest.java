package com.hospitalapp.backend.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class RescheduleAppointmentRequest {

    @NotNull(message = "New appointment date is required")
    @Future(message = "New appointment date must be in the future")
    private LocalDate newDate;

    @NotNull(message = "New start time is required")
    private LocalTime newStartTime;

    public RescheduleAppointmentRequest() {
    }

    public RescheduleAppointmentRequest(LocalDate newDate, LocalTime newStartTime) {
        this.newDate = newDate;
        this.newStartTime = newStartTime;
    }

    public LocalDate getNewDate() {
        return newDate;
    }

    public void setNewDate(LocalDate newDate) {
        this.newDate = newDate;
    }

    public LocalTime getNewStartTime() {
        return newStartTime;
    }

    public void setNewStartTime(LocalTime newStartTime) {
        this.newStartTime = newStartTime;
    }
}
