package com.placement.dto.request;

import com.placement.enums.CompanyStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 200)
    private String name;

    private String description;

    @Size(max = 300)
    private String website;

    private String logoUrl;

    @NotNull(message = "Package offered is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Package must be positive")
    private BigDecimal packageOffered;

    @NotNull(message = "Minimum CGPA is required")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private BigDecimal minimumCgpa;

    @Min(value = 0)
    private Integer maxBacklogs = 0;

    @NotNull(message = "Drive date is required")
    @Future(message = "Drive date must be in the future")
    private LocalDate driveDate;

    private String driveLocation;

    private LocalDateTime registrationDeadline;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    private String jobDescription;

    private CompanyStatus status = CompanyStatus.UPCOMING;

    // IDs of departments allowed to apply
    @NotEmpty(message = "At least one department must be allowed")
    private Set<Long> allowedDepartmentIds;
}
