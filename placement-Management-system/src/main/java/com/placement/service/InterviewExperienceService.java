package com.placement.service;

import com.placement.dto.request.InterviewExperienceRequest;
import com.placement.dto.Response.InterviewExperienceResponse;
import com.placement.entity.Company;
import com.placement.entity.InterviewExperience;
import com.placement.entity.User;
import com.placement.repository.CompanyRepository;
import com.placement.repository.InterviewExperienceRepository;
import com.placement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InterviewExperienceService {
    @Autowired
    private InterviewExperienceRepository interviewExperienceRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UserRepository userRepository;

    public InterviewExperienceResponse addExperience(Long studentId, InterviewExperienceRequest req) {
        InterviewExperience exp = new InterviewExperience();
        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<Company> companyOpt = companyRepository.findById(req.getCompanyId());
        if (studentOpt.isEmpty() || companyOpt.isEmpty()) return null;
        exp.setStudent(studentOpt.get());
        exp.setCompany(companyOpt.get());
        exp.setJobRole(req.getJobRole());
        exp.setRounds(req.getRounds());
        exp.setQuestions(req.getQuestions());
        exp.setDifficulty(req.getDifficulty());
        exp.setTips(req.getTips());
        exp.setCreatedAt(LocalDateTime.now());
        InterviewExperience saved = interviewExperienceRepository.save(exp);
        return toResponse(saved);
    }

    public List<InterviewExperienceResponse> search(String company, String role) {
        List<InterviewExperience> list;
        if (company != null && !company.isEmpty()) {
            list = interviewExperienceRepository.findByCompanyNameContainingIgnoreCase(company);
        } else if (role != null && !role.isEmpty()) {
            list = interviewExperienceRepository.findByJobRoleContainingIgnoreCase(role);
        } else {
            list = interviewExperienceRepository.findAll();
        }
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email).map(User::getId).orElse(null);
    }

    private InterviewExperienceResponse toResponse(InterviewExperience exp) {
        InterviewExperienceResponse res = new InterviewExperienceResponse();
        res.setId(exp.getId());
        res.setStudentName(exp.getStudent().getName());
        res.setCompanyName(exp.getCompany().getName());
        res.setJobRole(exp.getJobRole());
        res.setRounds(exp.getRounds());
        res.setQuestions(exp.getQuestions());
        res.setDifficulty(exp.getDifficulty());
        res.setTips(exp.getTips());
        res.setCreatedAt(exp.getCreatedAt());
        return res;
    }
}
