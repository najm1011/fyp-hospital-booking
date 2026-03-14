package com.hospitalapp.backend.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * One-time schema migration to replace the unconditional unique_doctor_slot
 * constraint with a partial unique index that excludes cancelled appointments.
 *
 * This allows a slot to be rebooked after cancellation.
 * Skipped in test profile since H2 doesn't support PostgreSQL partial indexes.
 */
@Component
@Profile("!test")
public class SchemaFixMigration {

    private static final Logger log = LoggerFactory.getLogger(SchemaFixMigration.class);

    @PersistenceContext
    private EntityManager entityManager;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void migrateUniqueConstraint() {
        try {
            // Drop the old unconditional unique constraint if it exists
            dropOldConstraint();
            // Create a partial unique index that only applies to non-cancelled appointments
            createPartialIndex();
        } catch (Exception e) {
            log.warn("Schema migration for unique_doctor_slot: {}", e.getMessage());
        }
    }

    private void dropOldConstraint() {
        try {
            entityManager.createNativeQuery(
                "ALTER TABLE appointments DROP CONSTRAINT IF EXISTS unique_doctor_slot"
            ).executeUpdate();
            log.info("Dropped old unique_doctor_slot constraint (if existed)");
        } catch (Exception e) {
            log.debug("Could not drop unique_doctor_slot constraint: {}", e.getMessage());
        }
    }

    private void createPartialIndex() {
        try {
            entityManager.createNativeQuery(
                "CREATE UNIQUE INDEX IF NOT EXISTS unique_doctor_slot_active " +
                "ON appointments (doctor_id, appointment_date, start_time) " +
                "WHERE status != 'CANCELLED'"
            ).executeUpdate();
            log.info("Created partial unique index unique_doctor_slot_active");
        } catch (Exception e) {
            log.debug("Could not create partial index (may already exist): {}", e.getMessage());
        }
    }
}
