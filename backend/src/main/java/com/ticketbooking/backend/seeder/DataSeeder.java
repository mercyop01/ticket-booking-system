package com.ticketbooking.backend.seeder;

import com.ticketbooking.backend.model.*;
import com.ticketbooking.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private SeatCategoryRepository seatCategoryRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventSeatPriceRepository eventSeatPriceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed users if none exist
        if (userRepository.count() == 0) {
            seedUsers();
        }

        // Only seed venues/events if the database is empty
        if (venueRepository.count() == 0) {
            seedData();
        } else {
            updateEventBanners();
        }
    }

    private void updateEventBanners() {
        List<Event> events = eventRepository.findAll();
        for (Event event : events) {
            switch (event.getTitle()) {
                case "Kalki 2898 AD":
                    event.setBannerUrl("https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800");
                    break;
                case "Stree 2":
                    event.setBannerUrl("https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800");
                    break;
                case "Pushpa 2: The Rule":
                    event.setBannerUrl("https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800");
                    break;
                case "Singham Returns":
                    event.setBannerUrl("https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800");
                    break;
                case "Arijit Singh Live Concert":
                    event.setBannerUrl("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800");
                    break;
                case "Diljit Dosanjh World Tour":
                    event.setBannerUrl("https://images.unsplash.com/photo-1501386761578-eaa54b4e9d59?w=800");
                    break;
            }
        }
        eventRepository.saveAll(events);
    }

    private void seedUsers() {
        User admin = User.builder()
                .name("Admin")
                .email("admin@tixnow.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        User organiser = User.builder()
                .name("Organiser")
                .email("organiser@tixnow.com")
                .password(passwordEncoder.encode("org123"))
                .role(Role.ORGANISER)
                .build();
        userRepository.save(organiser);

        User customer = User.builder()
                .name("Customer")
                .email("customer@tixnow.com")
                .password(passwordEncoder.encode("cust123"))
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(customer);
    }

    private void seedData() {
        User organiser = userRepository.findByEmail("organiser@tixnow.com")
            .orElseGet(() -> {
                User newOrg = User.builder()
                        .name("Organiser")
                        .email("organiser@tixnow.com")
                        .password(passwordEncoder.encode("org123"))
                        .role(Role.ORGANISER)
                        .build();
                return userRepository.save(newOrg);
            });

        // Seed Venue
        Venue pvr = Venue.builder()
                .name("PVR Cinemas")
                .city("Mumbai")
                .totalRows(10)
                .totalCols(10)
                .build();
        venueRepository.save(pvr);

        // Seed Seat Categories
        SeatCategory premium = SeatCategory.builder().venue(pvr).name("Premium").colorCode("#FFB300").build();
        SeatCategory gold = SeatCategory.builder().venue(pvr).name("Gold").colorCode("#9B59B6").build();
        SeatCategory standard = SeatCategory.builder().venue(pvr).name("Standard").colorCode("#5B8CFF").build();
        
        seatCategoryRepository.saveAll(List.of(premium, gold, standard));

        // Seed Seats
        List<Seat> seats = new ArrayList<>();
        for (int r = 0; r < pvr.getTotalRows(); r++) {
            String rowLabel = String.valueOf((char) ('A' + r));
            SeatCategory category;
            if (r < 3) category = premium;       // A, B, C
            else if (r < 6) category = gold;     // D, E, F
            else category = standard;            // G, H, I, J

            for (int c = 1; c <= pvr.getTotalCols(); c++) {
                seats.add(Seat.builder()
                        .venue(pvr)
                        .rowLabel(rowLabel)
                        .colNumber(c)
                        .category(category)
                        .build());
            }
        }
        seatRepository.saveAll(seats);

        // Seed Events
        List<Event> events = new ArrayList<>();
        events.add(Event.builder()
                .title("Kalki 2898 AD")
                .description("Epic sci-fi mythology.")
                .bannerUrl("https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800")
                .dateTime(LocalDateTime.now().plusDays(15))
                .venue(pvr)
                .organiser(organiser)
                .type(EventType.MOVIE)
                .status("PUBLISHED")
                .build());

        events.add(Event.builder()
                .title("Stree 2")
                .description("Horror comedy blockbuster.")
                .bannerUrl("https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800")
                .dateTime(LocalDateTime.now().plusDays(20))
                .venue(pvr)
                .organiser(organiser)
                .type(EventType.MOVIE)
                .status("PUBLISHED")
                .build());

        events.add(Event.builder()
                .title("Pushpa 2: The Rule")
                .description("The most awaited sequel.")
                .bannerUrl("https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800")
                .dateTime(LocalDateTime.now().plusDays(5))
                .venue(pvr)
                .organiser(organiser)
                .type(EventType.MOVIE)
                .status("PUBLISHED")
                .build());

        events.add(Event.builder()
                .title("Singham Returns")
                .description("Action packed cop drama.")
                .bannerUrl("https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800")
                .dateTime(LocalDateTime.now().plusDays(30))
                .venue(pvr)
                .organiser(organiser)
                .type(EventType.MOVIE)
                .status("PUBLISHED")
                .build());

        events.add(Event.builder()
                .title("Arijit Singh Live Concert")
                .description("Soulful live music.")
                .bannerUrl("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800")
                .dateTime(LocalDateTime.now().plusDays(40))
                .venue(pvr)
                .organiser(organiser)
                .type(EventType.CONCERT)
                .status("PUBLISHED")
                .build());

        events.add(Event.builder()
                .title("Diljit Dosanjh World Tour")
                .description("The biggest Punjabi party.")
                .bannerUrl("https://images.unsplash.com/photo-1501386761578-eaa54b4e9d59?w=800")
                .dateTime(LocalDateTime.now().plusDays(55))
                .venue(pvr)
                .organiser(organiser)
                .type(EventType.CONCERT)
                .status("PUBLISHED")
                .build());

        eventRepository.saveAll(events);

        // Seed Event Seat Prices
        List<EventSeatPrice> prices = new ArrayList<>();
        for (Event event : events) {
            prices.add(EventSeatPrice.builder().event(event).category(premium).price(new BigDecimal("480.00")).build());
            prices.add(EventSeatPrice.builder().event(event).category(gold).price(new BigDecimal("320.00")).build());
            prices.add(EventSeatPrice.builder().event(event).category(standard).price(new BigDecimal("190.00")).build());
        }
        eventSeatPriceRepository.saveAll(prices);
    }
}
