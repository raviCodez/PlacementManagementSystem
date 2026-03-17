package com.placement.controller;


import com.placement.enums.CompanyStatus;
import com.placement.security.JwtUtil;
import com.placement.service.CompanyService;
import com.placement.dto.Response.*;
import com.placement.dto.request.CompanyRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final JwtUtil        jwtUtil;

    // ── GET ALL ───────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAllCompanies() {
        return ResponseEntity.ok(
            ApiResponse.success(companyService.getAllCompanies()));
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(companyService.getCompanyById(id)));
    }

    // ── GET BY STATUS ─────────────────────────────────────────────────────
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getByStatus(
            @PathVariable CompanyStatus status) {
        return ResponseEntity.ok(
            ApiResponse.success(companyService.getCompaniesByStatus(status)));
    }

    // ── GET ELIGIBLE (Student only) ────────────────────────────────────────
    @GetMapping("/eligible")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getEligible(
            HttpServletRequest req) {
        Long studentId = extractUserId(req);
        return ResponseEntity.ok(
            ApiResponse.success(
                companyService.getEligibleCompaniesForStudent(studentId)));
    }

    // ── CREATE ────────────────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PLACEMENT_TEAM')")
    public ResponseEntity<ApiResponse<CompanyResponse>> create(
            @Valid @RequestBody CompanyRequest req,
            HttpServletRequest httpReq) {
        Long userId = extractUserId(httpReq);
        return ResponseEntity.status(201).body(
            ApiResponse.success("Company created successfully",
                companyService.addCompany(req, userId)));
    }

    // ── UPDATE ────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PLACEMENT_TEAM')")
    public ResponseEntity<ApiResponse<CompanyResponse>> update(
            @PathVariable Long id,
            @RequestBody CompanyRequest req) {
        return ResponseEntity.ok(
            ApiResponse.success("Company updated",
                companyService.updateCompany(id, req)));
    }

    // ── UPDATE STATUS ONLY ────────────────────────────────────────────────
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','PLACEMENT_TEAM')")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam CompanyStatus status) {
        return ResponseEntity.ok(
            ApiResponse.success("Status updated",
                companyService.updateStatus(id, status)));
    }

    // ── DELETE ────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company deleted", null));
    }

    // ── HELPER ────────────────────────────────────────────────────────────
    private Long extractUserId(HttpServletRequest req) {
        String token = req.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
// ```

// ---

// ### 🧠 Why, What, How — `CompanyController`

// **❓ WHY use `@PatchMapping` for status update instead of `@PutMapping`?**

// HTTP semantics matter:

// | Method | Meaning | When to use |
// |---|---|---|
// | `PUT` | Replace the **entire** resource | Full update of all fields |
// | `PATCH` | Update a **part** of the resource | Change just one field (status) |
// | `DELETE` | Remove the resource | Delete |

// `PATCH /companies/7/status?status=ACTIVE` is semantically correct — you're patching only the status field, not replacing the whole company. It also prevents the client from accidentally blanking out other fields.

// ---

// **📦 WHAT does a full company API flow look like?**
// ```
// POST   /api/companies              → Create (Admin/PT)
// GET    /api/companies              → List all
// GET    /api/companies/7            → Get one
// GET    /api/companies/status/UPCOMING → Filter by status
// GET    /api/companies/eligible     → Student's eligible list
// PUT    /api/companies/7            → Full update
// PATCH  /api/companies/7/status     → Status only
// DELETE /api/companies/7            → Admin only
