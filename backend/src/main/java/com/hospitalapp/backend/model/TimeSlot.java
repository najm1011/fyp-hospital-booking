package com.hospitalapp.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "time_slots", indexes = {
    @Index(name = "idx_timeslot_doctor", columnList = "doctor_id"),
    @Index(name = "idx_timeslot_day", columnList = "day_of_week"),
    @Index(name = "idx_timeslot_available", columnList = "is_available")
})
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @NotNull(message = "Day of week is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 20)
    private DayOfWeek dayOfWeek;

    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TimeSlot() {
    }

    public TimeSlot(Doctor doctor, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.doctor = doctor;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isAvailable = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimeSlot timeSlot = (TimeSlot) o;
        return Objects.equals(id, timeSlot.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TimeSlot{" +
                "id=" + id +
                ", dayOfWeek=" + dayOfWeek +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", isAvailable=" + isAvailable +
                '}';
    }
}
