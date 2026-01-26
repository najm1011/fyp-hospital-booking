package com.hospitalapp.backend.dto.appointment;

public class MonthlyAppointmentStats {
    private int year;
    private int month;
    private String monthName;
    private long total;
    private long scheduled;
    private long completed;
    private long cancelled;
    private long noShow;

    public MonthlyAppointmentStats() {
    }

    public MonthlyAppointmentStats(int year, int month, long total, long scheduled, long completed, long cancelled, long noShow) {
        this.year = year;
        this.month = month;
        this.monthName = getMonthNameFromNumber(month);
        this.total = total;
        this.scheduled = scheduled;
        this.completed = completed;
        this.cancelled = cancelled;
        this.noShow = noShow;
    }

    private String getMonthNameFromNumber(int month) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        if (month >= 1 && month <= 12) {
            return months[month - 1];
        }
        return "";
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
        this.monthName = getMonthNameFromNumber(month);
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getScheduled() {
        return scheduled;
    }

    public void setScheduled(long scheduled) {
        this.scheduled = scheduled;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getCancelled() {
        return cancelled;
    }

    public void setCancelled(long cancelled) {
        this.cancelled = cancelled;
    }

    public long getNoShow() {
        return noShow;
    }

    public void setNoShow(long noShow) {
        this.noShow = noShow;
    }
}
