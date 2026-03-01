package com.taskflow.controller;

import com.taskflow.exception.TaskNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ✅ IMPROVEMENT 1: Constructor injection instead of @Autowired field injection
//    - Makes dependencies explicit and testable without Spring context
//    - Allows fields to be final (immutable, thread-safe)
//    - IntelliJ/compiler will warn if a dependency is missing

// ✅ IMPROVEMENT 2: Swagger @Tag documents this whole controller in Swagger UI
@RestController
@RequestMapping("/api/v1")   // ✅ IMPROVEMENT 3: Version your API (/v1/) so you can
@CrossOrigin(origins = "*")  //    release /v2/ later without breaking existing clients
@Tag(name = "Tasks", description = "Task Management API")
public class TaskController {

    // ✅ IMPROVEMENT 1 (continued): final field + constructor injection
    //    No @Autowired needed — Spring auto-detects single-constructor injection
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ─────────────────────────────────────────────────────────────
    // HEALTH
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Returns API status")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "TaskFlow API",
                "version", "1.0"   // ✅ IMPROVEMENT 4: Add version to health response
        ));
    }

    // ─────────────────────────────────────────────────────────────
    // GET ALL
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/tasks")
    // ✅ IMPROVEMENT 5: @Operation + @ApiResponses document every possible
    //    HTTP response in Swagger UI so consumers know what to expect
    @Operation(summary = "Get all tasks", description = "Returns all tasks ordered by newest first")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // ─────────────────────────────────────────────────────────────
    // GET BY ID
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/tasks/{id}")
    @Operation(summary = "Get task by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Task found"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<Task> getTaskById(
            // ✅ IMPROVEMENT 6: @Parameter describes path/query variables in Swagger UI
            @Parameter(description = "ID of the task to retrieve", required = true)
            @PathVariable Long id) {

        // ✅ IMPROVEMENT 7: Throw a custom exception instead of returning empty Optional
        //    This triggers GlobalExceptionHandler to return a clean 404 JSON response
        //    instead of Spring's default ugly white-label error page
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/tasks")
    @ResponseStatus(HttpStatus.CREATED)  // ✅ IMPROVEMENT 8: @ResponseStatus declares the
    @Operation(summary = "Create a new task")   //    default status code clearly at method level
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Task created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input — validation failed")
    })
    public ResponseEntity<Task> createTask(
            @Parameter(description = "Task to create")
            @Valid @RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────────────────────

    @PutMapping("/tasks/{id}")
    @Operation(summary = "Update an existing task")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Task updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<Task> updateTask(
            @Parameter(description = "ID of the task to update", required = true)
            @PathVariable Long id,
            @Valid @RequestBody Task task) {

        // ✅ IMPROVEMENT 7 (continued): orElseThrow gives a meaningful 404 JSON body
        return taskService.updateTask(id, task)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────

    @DeleteMapping("/tasks/{id}")
    @Operation(summary = "Delete a task by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Task deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "ID of the task to delete", required = true)
            @PathVariable Long id) {

        // ✅ IMPROVEMENT 9: Throw exception directly — removes the if/return pattern
        //    which is less readable. Exception handler takes care of the 404 response.
        if (!taskService.deleteTask(id)) {
            throw new TaskNotFoundException(id);
        }
        return ResponseEntity.noContent().build();
    }
}