package com.placement.controller;

import com.placement.dto.Response.ApiResponse;
import com.placement.dto.Response.ApplicationResponse;
import com.placement.dto.Response.FeedbackResponse;
import com.placement.dto.Response.StudentSummaryResponse;
import com.placement.dto.request.StudentProfileUpdateRequest;
import com.placement.entity.Application;
import com.placement.security.JwtUtil;
import com.placement.service.ApplicationService;
import com.placement.service.FeedbackService;
import com.placement.service.StudentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * StudentController — handles all /api/student/** endpoints.
 * All endpoints require STUDENT role (enforced in SecurityConfig + @PreAuthorize).
 */
@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentService     studentService;
    private final ApplicationService applicationService;
    private final FeedbackService    feedbackService;
    private final JwtUtil            jwtUtil;

    // ── GET MY PROFILE ────────────────────────────────────────────────────
    /**
     * GET /api/student/profile
     * Returns the authenticated student's profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentSummaryResponse>> getProfile(
            HttpServletRequest req) {
        Long userId = extractUserId(req);
        return ResponseEntity.ok(
            ApiResponse.success(studentService.getStudentProfile(userId)));
    }

    // ── UPDATE MY PROFILE ─────────────────────────────────────────────────
    /**
     * PUT /api/student/profile
     * Updates CGPA, marks, skills, section, graduation year.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentSummaryResponse>> updateProfile(
            @Valid @RequestBody StudentProfileUpdateRequest request,
            HttpServletRequest req) {
        Long userId = extractUserId(req);
        return ResponseEntity.ok(
            ApiResponse.success(studentService.updateProfile(userId, request)));
    }

    // ── UPLOAD RESUME ─────────────────────────────────────────────────────
    /**
     * POST /api/student/resume
     * Accepts multipart/form-data with key "file" (PDF only, max 5MB).
     */
    @PostMapping("/resume")
    public ResponseEntity<ApiResponse<String>> uploadResume(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest req) throws IOException {
        Long userId = extractUserId(req);
        String resumeUrl = studentService.uploadResume(userId, file);
        return ResponseEntity.ok(
            ApiResponse.success("Resume uploaded", resumeUrl));
    }

    // ── APPLY TO COMPANY ──────────────────────────────────────────────────
    /**
     * POST /api/student/apply/{companyId}
     * Applies the authenticated student to the given company.
     * Business rules checked: CGPA, dept eligibility, duplicate, placed-lower-pkg.
     */
    @PostMapping("/apply/{companyId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyToCompany(
            @PathVariable Long companyId,
            HttpServletRequest req) {
        Long studentId = extractUserId(req);
        Application application = applicationService.applyToCompany(studentId, companyId);
        return ResponseEntity.status(201).body(
            ApiResponse.success("Applied successfully", toAppResponse(application)));
    }

    // ── VIEW MY APPLICATIONS ─────────────────────────────────────────────
    /**
     * GET /api/student/applications
     * Returns all applications submitted by the authenticated student.
     */
    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> myApplications(
            HttpServletRequest req) {
        Long studentId = extractUserId(req);
        List<ApplicationResponse> responses = applicationService
            .getStudentApplications(studentId)
            .stream()
            .map(this::toAppResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // ── GET MY FEEDBACK ──────────────────────────────────────────────────
    /**
     * GET /api/student/feedback
     * Returns all feedback given to the authenticated student.
     */
    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> myFeedback(
            HttpServletRequest req) {
        Long studentId = extractUserId(req);
        return ResponseEntity.ok(
            ApiResponse.success(feedbackService.getFeedbackForStudent(studentId)));
    }

    // ── HELPER: Extract userId from JWT ────────────────────────────────────
    private Long extractUserId(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        return jwtUtil.extractUserId(authHeader.substring(7));
    }

    // ── HELPER: Application entity → DTO ──────────────────────────────────
    private ApplicationResponse toAppResponse(Application a) {
        return ApplicationResponse.builder()
            .id(a.getId())
            .studentId(a.getStudent().getId())
            .studentName(a.getStudent().getName())
            .studentEmail(a.getStudent().getEmail())
            .rollNumber(a.getStudent().getStudentProfile() != null
                ? a.getStudent().getStudentProfile().getRollNumber() : null)
            .departmentName(a.getStudent().getDepartment() != null
                ? a.getStudent().getDepartment().getName() : null)
            .companyId(a.getCompany().getId())
            .companyName(a.getCompany().getName())
            .status(a.getStatus())
            .remarks(a.getRemarks())
            .appliedAt(a.getAppliedAt())
            .updatedAt(a.getUpdatedAt())
            .build();
    }
}
