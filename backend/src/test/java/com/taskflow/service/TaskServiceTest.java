package com.taskflow.service;

import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = new Task();
        sampleTask.setId(1L);
        sampleTask.setTitle("Test Task");
        sampleTask.setCompleted(false);
    }

    @Test
    void getAllTasks_returnsAllTasks() {
        when(taskRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(sampleTask));
        List<Task> tasks = taskService.getAllTasks();
        assertThat(tasks).hasSize(1);
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
    }

    @Test
    void createTask_savesAndReturnsTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        Task created = taskService.createTask(sampleTask);
        assertThat(created.getId()).isEqualTo(1L);
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    void getTaskById_returnsTask_whenExists() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        Optional<Task> result = taskService.getTaskById(1L);
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Task");
    }

    @Test
    void getTaskById_returnsEmpty_whenNotExists() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());
        Optional<Task> result = taskService.getTaskById(99L);
        assertThat(result).isEmpty();
    }

    @Test
    void deleteTask_returnsTrue_whenExists() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        boolean deleted = taskService.deleteTask(1L);
        assertThat(deleted).isTrue();
        verify(taskRepository).deleteById(1L);
    }

    @Test
    void deleteTask_returnsFalse_whenNotExists() {
        when(taskRepository.existsById(99L)).thenReturn(false);
        boolean deleted = taskService.deleteTask(99L);
        assertThat(deleted).isFalse();
    }
}
