package com.hospitalapp.backend.dto.appointment;

public class AppointmentStatsResponse {

    private long upcoming;
    private long completed;
    private long cancelled;
    private long noShow;
    private long total;

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

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    private void updateTotal() {
        this.total = upcoming + completed + cancelled + noShow;
    }
}
