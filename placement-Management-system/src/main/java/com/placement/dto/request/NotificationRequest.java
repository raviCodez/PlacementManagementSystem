package com.placement.dto.request;


import com.placement.enums.NotificationType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 300)
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull
    private NotificationType type;

    // If null → broadcast to all students
    // If provided → send only to these student IDs
    private List<Long> recipientIds;

    // Optional: link notification to a company drive
    private Long companyId;

    // Optional: send to an entire department
    private Long departmentId;
}
