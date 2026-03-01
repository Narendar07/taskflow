package com.taskflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// ✅ @RestControllerAdvice intercepts ALL exceptions thrown by any controller
//    and converts them into clean, consistent JSON error responses.
//
//    Without this, Spring returns its default "white label error page" HTML
//    which is useless to API consumers / the React frontend.
//
//    With this, every error looks like:
//    {
//      "status": 404,
//      "error": "Not Found",
//      "message": "Task not found with ID: 99",
//      "timestamp": "2026-02-28T10:00:00"
//    }

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Handles TaskNotFoundException → 404 ─────────────────────
    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleTaskNotFound(TaskNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ── Handles @Valid failures → 400 ───────────────────────────
    // Triggered when @RequestBody fails validation (e.g. blank title)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        // Collect ALL field errors into a list so the client knows
        // exactly which fields failed and why
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .toList();

        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("error", "Validation Failed");
        body.put("messages", errors);
        body.put("timestamp", LocalDateTime.now());

        return ResponseEntity.badRequest().body(body);
    }

    // ── Handles any unexpected exception → 500 ──────────────────
    // Safety net — catches anything not handled above
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericError(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again.");
    }

    // ── Shared helper ────────────────────────────────────────────
    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(status).body(body);
    }
}