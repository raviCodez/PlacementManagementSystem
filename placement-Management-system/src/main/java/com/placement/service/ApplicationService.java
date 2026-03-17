package com.placement.service;

import com.placement.enums.ApplicationStatus;
import com.placement.repository.*;
import com.placement.entity.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final StudentProfileRepository profileRepository;
    private final NotificationService notificationService;
    private final PlacementRecordRepository placementRecordRepository;

    @Transactional
    public Application applyToCompany(Long studentId, Long companyId) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found."));
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found."));

        // ── Business Rule 1: No duplicate applications ──
        if (applicationRepository.existsByStudentIdAndCompanyId(studentId, companyId)) {
            throw new RuntimeException("Already applied to this company.");
        }

        StudentProfile profile = profileRepository.findByUserId(studentId)
            .orElseThrow(() -> new RuntimeException("Student profile not found."));

        // ── Business Rule 2: CGPA check ──
        if (profile.getCgpa().compareTo(company.getMinimumCgpa()) < 0) {
            throw new RuntimeException(
                "CGPA below requirement. Required: " + company.getMinimumCgpa());
        }

        // ── Business Rule 3: Department check ──
        boolean deptAllowed = company.getAllowedDepartments().stream()
            .anyMatch(d -> d.getId().equals(student.getDepartment().getId()));
        if (!deptAllowed) {
            throw new RuntimeException("Your department is not eligible for this company.");
        }

        // ── Business Rule 4: Already placed? Block lower package ──
        if (profile.isPlaced() && profile.getPackageOffered() != null) {
            if (company.getPackageOffered().compareTo(profile.getPackageOffered()) < 0) {
                throw new RuntimeException(
                    "Cannot apply to company with lower package after being placed.");
            }
        }

        Application application = Application.builder()
            .student(student)
            .company(company)
            .status(ApplicationStatus.APPLIED)
            .build();

        return applicationRepository.save(application);
    }

    @Transactional
    public Application updateStatus(Long applicationId,
                                     ApplicationStatus newStatus,
                                     String remarks) {
        Application app = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found."));

        app.setStatus(newStatus);
        app.setRemarks(remarks);
        applicationRepository.save(app);

        // ── Auto-update placement on SELECTED ──
        if (newStatus == ApplicationStatus.SELECTED) {
            markStudentAsPlaced(app.getStudent(), app.getCompany());
        }

        // ── Send notification ──
        notificationService.sendApplicationStatusNotification(app);

        return app;
    }

    private void markStudentAsPlaced(User student, Company company) {
        StudentProfile profile = profileRepository.findByUserId(student.getId())
            .orElseThrow();
        profile.setPlaced(true);
        profile.setPlacedCompany(company);
        profile.setPackageOffered(company.getPackageOffered());
        profileRepository.save(profile);

        PlacementRecord record = PlacementRecord.builder()
            .student(student)
            .company(company)
            .packageOffered(company.getPackageOffered())
            .build();
        placementRecordRepository.save(record);
    }

    public List<Application> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getCompanyApplications(Long companyId) {
        return applicationRepository.findByCompanyId(companyId);
    }

    public List<Application> getAllApplications() {
    return applicationRepository.findAll();
}

public List<Application> getApplicationsByCompanyAndStatus(
        Long companyId, ApplicationStatus status) {
    return applicationRepository.findByCompanyAndStatus(companyId, status);
}

}
