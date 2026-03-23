package com.placement.controller;

import com.placement.dto.Response.ApiResponse;
import com.placement.entity.Department;
import com.placement.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        return ResponseEntity.ok(
            ApiResponse.success(
                departmentRepository.findAllByOrderByNameAsc()
            )
        );
    }
}