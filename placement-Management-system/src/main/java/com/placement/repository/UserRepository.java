// ─────────────────────────────────────────
// repository/UserRepository.java
// ─────────────────────────────────────────
package com.placement.repository;

import com.placement.entity.User;
import com.placement.enums.Role;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.role = 'STUDENT' AND u.department.id = :deptId")
    List<User> findStudentsByDepartment(@Param("deptId") Long departmentId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT'")
    long countTotalStudents();

    @Query("""
        SELECT u FROM User u
        JOIN StudentProfile sp ON sp.user = u
        WHERE u.role = 'STUDENT'
        AND (:dept IS NULL OR u.department.id = :dept)
        AND (:section IS NULL OR sp.section = :section)
        AND (:isPlaced IS NULL OR sp.isPlaced = :isPlaced)
        """)
    List<User> filterStudents(
        @Param("dept")     Long departmentId,
        @Param("section")  String section,
        @Param("isPlaced") Boolean isPlaced
    );
}
