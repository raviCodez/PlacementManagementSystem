package com.placement.entity;

// ─────────────────────────────────────────
// entity/PlacementRecord.java
// ─────────────────────────────────────────

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_record")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlacementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", unique = true, nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "package_offered", precision = 10, scale = 2)
    private BigDecimal packageOffered;

    @Column(name = "offer_letter_url", length = 500)
    private String offerLetterUrl;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @CreationTimestamp
    private LocalDateTime placedAt;
}