package com.hospitalapp.backend.dto.doctor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class UpdateAvailabilityRequest {

    @NotNull(message = "Time slots are required")
    @Valid
    private List<TimeSlotRequest> timeSlots;

    public UpdateAvailabilityRequest() {
    }

    public UpdateAvailabilityRequest(List<TimeSlotRequest> timeSlots) {
        this.timeSlots = timeSlots;
    }

    public List<TimeSlotRequest> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(List<TimeSlotRequest> timeSlots) {
        this.timeSlots = timeSlots;
    }
}
