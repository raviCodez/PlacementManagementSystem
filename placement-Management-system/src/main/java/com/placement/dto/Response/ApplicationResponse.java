package com.placement.dto.Response;


import com.placement.enums.ApplicationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationResponse {

    private Long   id;

    // Student info
    private Long   studentId;
    private String studentName;
    private String studentEmail;
    private String rollNumber;
    private String departmentName;

    // Company info
    private Long   companyId;
    private String companyName;

    // Application details
    private ApplicationStatus status;
    private String            remarks;
    private LocalDateTime     appliedAt;
    private LocalDateTime     updatedAt;
}