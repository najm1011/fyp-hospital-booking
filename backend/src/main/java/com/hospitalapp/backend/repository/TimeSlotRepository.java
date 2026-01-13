package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByDoctorId(Long doctorId);

    List<TimeSlot> findByDoctorIdAndIsAvailable(Long doctorId, Boolean isAvailable);

    List<TimeSlot> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek);

    @Query("SELECT t FROM TimeSlot t WHERE t.doctor.id = :doctorId AND t.dayOfWeek = :dayOfWeek AND t.isAvailable = true")
    List<TimeSlot> findAvailableSlotsByDoctorAndDay(@Param("doctorId") Long doctorId,
                                                     @Param("dayOfWeek") DayOfWeek dayOfWeek);

    @Query("SELECT t FROM TimeSlot t WHERE t.doctor.id = :doctorId AND t.dayOfWeek = :dayOfWeek " +
           "AND t.startTime = :startTime AND t.endTime = :endTime")
    Optional<TimeSlot> findByDoctorAndDayAndTime(@Param("doctorId") Long doctorId,
                                                  @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                                  @Param("startTime") LocalTime startTime,
                                                  @Param("endTime") LocalTime endTime);

    @Query("SELECT t FROM TimeSlot t WHERE t.doctor.id = :doctorId " +
           "ORDER BY t.dayOfWeek, t.startTime")
    List<TimeSlot> findByDoctorIdOrderedByDayAndTime(@Param("doctorId") Long doctorId);

    @Query("SELECT t FROM TimeSlot t WHERE t.doctor.id = :doctorId AND t.isAvailable = true " +
           "AND t.startTime >= :minTime AND t.endTime <= :maxTime")
    List<TimeSlot> findAvailableSlotsInTimeRange(@Param("doctorId") Long doctorId,
                                                  @Param("minTime") LocalTime minTime,
                                                  @Param("maxTime") LocalTime maxTime);

    @Query("SELECT COUNT(t) FROM TimeSlot t WHERE t.doctor.id = :doctorId AND t.isAvailable = true")
    long countAvailableSlots(@Param("doctorId") Long doctorId);

    boolean existsByDoctorIdAndDayOfWeekAndStartTimeAndEndTime(Long doctorId, DayOfWeek dayOfWeek,
                                                                LocalTime startTime, LocalTime endTime);
}
