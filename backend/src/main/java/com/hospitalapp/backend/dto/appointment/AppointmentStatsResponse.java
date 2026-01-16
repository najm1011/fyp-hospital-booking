package com.hospitalapp.backend.dto.appointment;

public class AppointmentStatsResponse {

    private long upcoming;
    private long completed;
    private long cancelled;
    private long noShow;
    private long pending;
    private long scheduled;
    private long confirmed;
    private long total;

    // Additional stats for dashboard
    private long todayCount;
    private long completedToday;
    private long uniqueDoctorsCount;
    private long uniquePatientsCount;
    private long totalDoctors;
    private long totalPatients;
    private long totalDepartments;

    public AppointmentStatsResponse() {
    }

    public AppointmentStatsResponse(long upcoming, long completed, long cancelled, long noShow) {
        this.upcoming = upcoming;
        this.completed = completed;
        this.cancelled = cancelled;
        this.noShow = noShow;
        this.total = upcoming + completed + cancelled + noShow;
    }

    public long getUpcoming() {
        return upcoming;
    }

    public void setUpcoming(long upcoming) {
        this.upcoming = upcoming;
        updateTotal();
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
        updateTotal();
    }

    public long getCancelled() {
        return cancelled;
    }

    public void setCancelled(long cancelled) {
        this.cancelled = cancelled;
        updateTotal();
    }

    public long getNoShow() {
        return noShow;
    }

    public void setNoShow(long noShow) {
        this.noShow = noShow;
        updateTotal();
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getScheduled() {
        return scheduled;
    }

    public void setScheduled(long scheduled) {
        this.scheduled = scheduled;
    }

    public long getConfirmed() {
        return confirmed;
    }

    public void setConfirmed(long confirmed) {
        this.confirmed = confirmed;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getTodayCount() {
        return todayCount;
    }

    public void setTodayCount(long todayCount) {
        this.todayCount = todayCount;
    }

    public long getCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(long completedToday) {
        this.completedToday = completedToday;
    }

    public long getUniqueDoctorsCount() {
        return uniqueDoctorsCount;
    }

    public void setUniqueDoctorsCount(long uniqueDoctorsCount) {
        this.uniqueDoctorsCount = uniqueDoctorsCount;
    }

    public long getUniquePatientsCount() {
        return uniquePatientsCount;
    }

    public void setUniquePatientsCount(long uniquePatientsCount) {
        this.uniquePatientsCount = uniquePatientsCount;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    private void updateTotal() {
        this.total = upcoming + completed + cancelled + noShow;
    }
}
