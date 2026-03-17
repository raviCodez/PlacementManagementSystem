package com.placement.service;


import com.placement.enums.Role;
import com.placement.repository.*;
import com.placement.dto.Response.FeedbackResponse;
import com.placement.entity.*;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final FeedbackRepository   feedbackRepository;
    private final UserRepository       userRepository;
    private final CompanyRepository    companyRepository;

    // ── ADD FEEDBACK (Admin or Coordinator) ───────────────────────────────
    @Transactional
    public FeedbackResponse addFeedback(Long studentId,
                                         Long companyId,
                                         Integer rating,
                                         String comments,
                                         Long givenByUserId) {

        // 1. Validate student exists and is a STUDENT
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found."));
        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("Feedback can only be given for students.");
        }

        // 2. Validate giver is Admin or Coordinator
        User givenBy = userRepository.findById(givenByUserId)
            .orElseThrow(() -> new RuntimeException("User not found."));
        if (givenBy.getRole() != Role.ADMIN
                && givenBy.getRole() != Role.DEPARTMENT_COORDINATOR) {
            throw new RuntimeException(
                "Only Admin or Department Coordinator can give feedback.");
        }

        // 3. Coordinator scope check — can only give feedback
        //    to students in their own department
        if (givenBy.getRole() == Role.DEPARTMENT_COORDINATOR) {
            if (givenBy.getDepartment() == null
                    || student.getDepartment() == null
                    || !givenBy.getDepartment().getId()
                               .equals(student.getDepartment().getId())) {
                throw new RuntimeException(
                    "Coordinator can only give feedback to students"
                    + " in their own department.");
            }
        }

        // 4. Validate rating range
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        // 5. Resolve company (optional)
        Company company = null;
        if (companyId != null) {
            company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found."));
        }

        // 6. Save feedback
        Feedback feedback = Feedback.builder()
            .student(student)
            .company(company)
            .givenBy(givenBy)
            .rating(rating)
            .comments(comments)
            .build();

        Feedback saved = feedbackRepository.save(feedback);
        log.info("Feedback added for student: {} by: {}",
            student.getEmail(), givenBy.getEmail());

        return toResponse(saved);
    }

    // ── GET FEEDBACK FOR A STUDENT ─────────────────────────────────────────
    public List<FeedbackResponse> getFeedbackForStudent(Long studentId) {
        return feedbackRepository.findByStudentId(studentId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ── GET FEEDBACK FOR ENTIRE DEPARTMENT (Coordinator view) ──────────────
    public List<FeedbackResponse> getFeedbackForDepartment(Long departmentId,
                                                             Long requesterId) {
        // Scope check — coordinator can only see their own dept
        User requester = userRepository.findById(requesterId)
            .orElseThrow(() -> new RuntimeException("User not found."));

        if (requester.getRole() == Role.DEPARTMENT_COORDINATOR) {
            if (!requester.getDepartment().getId().equals(departmentId)) {
                throw new RuntimeException(
                    "Access denied: not your department.");
            }
        }

        return feedbackRepository.findByStudent_Department_Id(departmentId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ── UPDATE FEEDBACK ────────────────────────────────────────────────────
    @Transactional
    public FeedbackResponse updateFeedback(Long feedbackId,
                                            Integer rating,
                                            String comments,
                                            Long requesterId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new RuntimeException("Feedback not found."));

        // Only the original giver can update
        if (!feedback.getGivenBy().getId().equals(requesterId)) {
            throw new RuntimeException(
                "Only the feedback author can update it.");
        }

        if (rating != null)   feedback.setRating(rating);
        if (comments != null) feedback.setComments(comments);

        return toResponse(feedbackRepository.save(feedback));
    }

    // ── DELETE FEEDBACK ────────────────────────────────────────────────────
    @Transactional
    public void deleteFeedback(Long feedbackId, Long requesterId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new RuntimeException("Feedback not found."));

        User requester = userRepository.findById(requesterId)
            .orElseThrow(() -> new RuntimeException("User not found."));

        // Admin can delete any; others only their own
        boolean isAdmin = requester.getRole() == Role.ADMIN;
        boolean isOwner = feedback.getGivenBy().getId().equals(requesterId);

        if (!isAdmin && !isOwner) {
            throw new RuntimeException(
                "Not authorized to delete this feedback.");
        }

        feedbackRepository.deleteById(feedbackId);
        log.info("Feedback {} deleted by userId: {}", feedbackId, requesterId);
    }

    // ── ENTITY → DTO ──────────────────────────────────────────────────────
    private FeedbackResponse toResponse(Feedback f) {
        return FeedbackResponse.builder()
            .id(f.getId())
            .studentId(f.getStudent().getId())
            .studentName(f.getStudent().getName())
            .companyId(f.getCompany()  != null ? f.getCompany().getId()   : null)
            .companyName(f.getCompany()!= null ? f.getCompany().getName() : null)
            .givenById(f.getGivenBy().getId())
            .givenByName(f.getGivenBy().getName())
            .givenByRole(f.getGivenBy().getRole().name())
            .rating(f.getRating())
            .comments(f.getComments())
            .createdAt(f.getCreatedAt())
            .build();
    }
}
