package com.taskflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.exception.GlobalExceptionHandler;
import com.taskflow.exception.TaskNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)               // ✅ Only loads TaskController — fast & focused
@Import(GlobalExceptionHandler.class)           // ✅ Must import this so @ControllerAdvice works in tests
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean                                   // ✅ Replaces real TaskService with a mock
    private TaskService taskService;

    // ─── GET /api/v1/health ──────────────────────────────────────
    @Test
    void health_returns200() throws Exception {
        mockMvc.perform(get("/api/v1/health"))  // ✅ FIXED: was /api/health
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    // ─── GET /api/v1/tasks ───────────────────────────────────────
    @Test
    void getAllTasks_returns200WithList() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Buy milk");

        when(taskService.getAllTasks()).thenReturn(List.of(task));

        mockMvc.perform(get("/api/v1/tasks"))   // ✅ FIXED: was /api/tasks
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Buy milk"));
    }

    // ─── GET /api/v1/tasks — empty list ─────────────────────────
    @Test
    void getAllTasks_returns200WithEmptyList() throws Exception {
        when(taskService.getAllTasks()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    // ─── POST /api/v1/tasks ──────────────────────────────────────
    @Test
    void createTask_returns201() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("New task");
        task.setCompleted(false);

        when(taskService.createTask(any())).thenReturn(task);

        mockMvc.perform(post("/api/v1/tasks")   // ✅ FIXED: was /api/tasks
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("New task"));
    }

    // ─── GET /api/v1/tasks/{id} — found ─────────────────────────
    @Test
    void getTaskById_returns200_whenFound() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Found task");

        when(taskService.getTaskById(1L)).thenReturn(Optional.of(task));

        mockMvc.perform(get("/api/v1/tasks/1")) // ✅ FIXED: was /api/tasks/1
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Found task"));
    }

    // ─── GET /api/v1/tasks/{id} — not found ─────────────────────
    @Test
    void getTaskById_returns404_whenNotFound() throws Exception {
        // ✅ FIXED: Controller now throws TaskNotFoundException → GlobalExceptionHandler → 404
        //    So mock the service to throw the exception too
        when(taskService.getTaskById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/tasks/99")) // ✅ FIXED: was /api/tasks/99
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Task not found with ID: 99"));
    }

    // ─── PUT /api/v1/tasks/{id} ──────────────────────────────────
    @Test
    void updateTask_returns200_whenFound() throws Exception {
        Task updated = new Task();
        updated.setId(1L);
        updated.setTitle("Updated task");
        updated.setCompleted(true);

        when(taskService.updateTask(eq(1L), any())).thenReturn(Optional.of(updated));

        mockMvc.perform(put("/api/v1/tasks/1")  // ✅ FIXED: was /api/tasks/1
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    // ─── PUT /api/v1/tasks/{id} — not found ─────────────────────
    @Test
    void updateTask_returns404_whenNotFound() throws Exception {
        Task task = new Task();
        task.setTitle("Ghost task");

        when(taskService.updateTask(eq(99L), any())).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/v1/tasks/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isNotFound());
    }

    // ─── DELETE /api/v1/tasks/{id} — success ────────────────────
    @Test
    void deleteTask_returns204_whenDeleted() throws Exception {
        when(taskService.deleteTask(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/tasks/1")) // ✅ FIXED: was /api/tasks/1
                .andExpect(status().isNoContent());
    }

    // ─── DELETE /api/v1/tasks/{id} — not found ──────────────────
    @Test
    void deleteTask_returns404_whenNotFound() throws Exception {
        when(taskService.deleteTask(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/v1/tasks/99"))
                .andExpect(status().isNotFound());
    }
}