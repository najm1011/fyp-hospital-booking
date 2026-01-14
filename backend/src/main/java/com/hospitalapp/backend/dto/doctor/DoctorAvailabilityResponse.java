package com.hospitalapp.backend.dto.doctor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class DoctorAvailabilityResponse {

    private Long doctorId;
    private String doctorName;
    private List<WeeklySchedule> weeklySchedule;
    private List<AvailableDate> availableDates;

    public DoctorAvailabilityResponse() {
    }

    public DoctorAvailabilityResponse(Long doctorId, String doctorName) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
    }

    // Getters and Setters

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public List<WeeklySchedule> getWeeklySchedule() {
        return weeklySchedule;
    }

    public void setWeeklySchedule(List<WeeklySchedule> weeklySchedule) {
        this.weeklySchedule = weeklySchedule;
    }

    public List<AvailableDate> getAvailableDates() {
        return availableDates;
    }

    public void setAvailableDates(List<AvailableDate> availableDates) {
        this.availableDates = availableDates;
    }

    // Inner class for weekly schedule
    public static class WeeklySchedule {
        private DayOfWeek dayOfWeek;
        private String dayName;
        private List<TimeRange> timeRanges;
        private boolean isAvailable;

        public WeeklySchedule() {
        }

        public WeeklySchedule(DayOfWeek dayOfWeek, List<TimeRange> timeRanges) {
            this.dayOfWeek = dayOfWeek;
            this.dayName = dayOfWeek.toString();
            this.timeRanges = timeRanges;
            this.isAvailable = timeRanges != null && !timeRanges.isEmpty();
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

        public List<TimeRange> getTimeRanges() {
            return timeRanges;
        }

        public void setTimeRanges(List<TimeRange> timeRanges) {
            this.timeRanges = timeRanges;
        }

        public boolean isAvailable() {
            return isAvailable;
        }

        public void setAvailable(boolean available) {
            isAvailable = available;
        }
    }

    // Inner class for time range
    public static class TimeRange {
        private LocalTime startTime;
        private LocalTime endTime;

        public TimeRange() {
        }

        public TimeRange(LocalTime startTime, LocalTime endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
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
    }

    // Inner class for available dates
    public static class AvailableDate {
        private LocalDate date;
        private DayOfWeek dayOfWeek;
        private String dayName;
        private int availableSlots;
        private int totalSlots;

        public AvailableDate() {
        }

        public AvailableDate(LocalDate date, int availableSlots, int totalSlots) {
            this.date = date;
            this.dayOfWeek = date.getDayOfWeek();
            this.dayName = dayOfWeek.toString();
            this.availableSlots = availableSlots;
            this.totalSlots = totalSlots;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
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

        public int getAvailableSlots() {
            return availableSlots;
        }

        public void setAvailableSlots(int availableSlots) {
            this.availableSlots = availableSlots;
        }

        public int getTotalSlots() {
            return totalSlots;
        }

        public void setTotalSlots(int totalSlots) {
            this.totalSlots = totalSlots;
        }
    }
}
