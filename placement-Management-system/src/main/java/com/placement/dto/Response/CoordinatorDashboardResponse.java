package com.placement.dto.Response;


import lombok.*;
import java.util.List;
import java.util.Map;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CoordinatorDashboardResponse {

    // ── Department Identity ───────────────────
    private String departmentName;
    private String departmentCode;

    // ── Student Overview ──────────────────────
    private long totalStudentsInDept;
    private long placedStudentsInDept;
    private long unplacedStudentsInDept;
    private double deptPlacementPercentage;

    // ── Eligibility ───────────────────────────
    // How many dept students are eligible for each upcoming drive
    // Map<CompanyName, EligibleCount>
    private Map<String, Long> eligibleStudentsPerDrive;

    // ── Application Stats (dept-scoped) ───────
    private long totalApplicationsByDeptStudents;
    private long shortlistedFromDept;
    private long selectedFromDept;
    private long rejectedFromDept;

    // ── Feedback ──────────────────────────────
    private List<FeedbackResponse> recentFeedbacksForDeptStudents;

    // ── Student List Snapshots ─────────────────
    private List<StudentSummaryResponse> recentlyPlacedStudents;
    private List<StudentSummaryResponse> unplacedEligibleStudents;
}
