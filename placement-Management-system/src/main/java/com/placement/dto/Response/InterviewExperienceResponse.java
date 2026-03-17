package com.placement.dto.Response;

import java.time.LocalDateTime;
import java.util.List;

public class InterviewExperienceResponse {
    private Long id;
    private String studentName;
    private String companyName;
    private String jobRole;
    private String rounds;
    private List<String> questions;
    private String difficulty;
    private String tips;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public String getRounds() { return rounds; }
    public void setRounds(String rounds) { this.rounds = rounds; }
    public List<String> getQuestions() { return questions; }
    public void setQuestions(List<String> questions) { this.questions = questions; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getTips() { return tips; }
    public void setTips(String tips) { this.tips = tips; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
