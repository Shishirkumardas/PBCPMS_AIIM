package org.example.pbcpms_aiim.models;

import jakarta.persistence.*;
import lombok.*;
import org.example.pbcpms_aiim.enums.VesselStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "vessels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vessel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Users owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VesselStatus status = VesselStatus.PENDING;

    private String rejectionReason;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
}
