package com.taskflow.exception;

// ✅ Extends RuntimeException so you don't need try/catch everywhere
//    Spring handles it via @ControllerAdvice automatically
public class TaskNotFoundException extends RuntimeException {

    private final Long taskId;

    public TaskNotFoundException(Long taskId) {
        super("Task not found with ID: " + taskId);
        this.taskId = taskId;
    }

    public Long getTaskId() {
        return taskId;
    }
}