package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganiserId(Long organiserId);
}
