package com.hospitalapp.backend.dto.appointment;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private List<MonthlyAppointmentStats> monthlyStats;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> weekdayDistribution;
    private long totalAppointments;
    private long totalPatients;
    private long totalDoctors;
    private double completionRate;
    private double cancellationRate;
    private double noShowRate;

    public AnalyticsResponse() {
    }

    public List<MonthlyAppointmentStats> getMonthlyStats() {
        return monthlyStats;
    }

    public void setMonthlyStats(List<MonthlyAppointmentStats> monthlyStats) {
        this.monthlyStats = monthlyStats;
    }

    public Map<String, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<String, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public Map<String, Long> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }

    public Map<String, Long> getWeekdayDistribution() {
        return weekdayDistribution;
    }

    public void setWeekdayDistribution(Map<String, Long> weekdayDistribution) {
        this.weekdayDistribution = weekdayDistribution;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getCancellationRate() {
        return cancellationRate;
    }

    public void setCancellationRate(double cancellationRate) {
        this.cancellationRate = cancellationRate;
    }

    public double getNoShowRate() {
        return noShowRate;
    }

    public void setNoShowRate(double noShowRate) {
        this.noShowRate = noShowRate;
    }
}
