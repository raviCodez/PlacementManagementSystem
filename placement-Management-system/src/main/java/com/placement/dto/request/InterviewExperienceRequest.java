package com.placement.dto.request;

import java.util.List;

public class InterviewExperienceRequest {
    private Long companyId;
    private String jobRole;
    private String rounds;
    private List<String> questions;
    private String difficulty;
    private String tips;

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
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
}
