package com.hospitalapp.backend.dto.doctor;

import com.hospitalapp.backend.model.TimeSlot;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class TimeSlotResponse {

    private Long id;
    private DayOfWeek dayOfWeek;
    private String dayName;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;

    public TimeSlotResponse() {
    }

    public static TimeSlotResponse fromEntity(TimeSlot timeSlot) {
        TimeSlotResponse response = new TimeSlotResponse();
        response.setId(timeSlot.getId());
        response.setDayOfWeek(timeSlot.getDayOfWeek());
        response.setDayName(formatDayName(timeSlot.getDayOfWeek()));
        response.setStartTime(timeSlot.getStartTime());
        response.setEndTime(timeSlot.getEndTime());
        response.setIsAvailable(timeSlot.getIsAvailable());
        return response;
    }

    private static String formatDayName(DayOfWeek day) {
        String name = day.toString();
        return name.charAt(0) + name.substring(1).toLowerCase();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}
