package com.placement.controller;

import com.placement.dto.request.InterviewExperienceRequest;
import com.placement.dto.Response.InterviewExperienceResponse;
import com.placement.service.InterviewExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview-experiences")
public class InterviewExperienceController {
    @Autowired
    private InterviewExperienceService interviewExperienceService;

    @PostMapping
    public ResponseEntity<?> addExperience(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody InterviewExperienceRequest req) {
        // Assume userDetails.getUsername() is email, fetch userId from service/repo
        Long studentId = interviewExperienceService.getUserIdByEmail(userDetails.getUsername());
        InterviewExperienceResponse res = interviewExperienceService.addExperience(studentId, req);
        if (res == null) return ResponseEntity.badRequest().body("Invalid student or company");
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<InterviewExperienceResponse>> search(@RequestParam(required = false) String company,
                                                                   @RequestParam(required = false) String role) {
        return ResponseEntity.ok(interviewExperienceService.search(company, role));
    }
}
