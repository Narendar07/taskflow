// src/hooks/useTasks.js
// Single source of truth for all task state and operations.
// Components just call these functions — they don't talk to the API directly.

import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  // ── FETCH ────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── CREATE ───────────────────────────────────────────────────
  const createTask = useCallback(async (title) => {
    if (!title?.trim()) return;
    try {
      setError(null);
      const newTask = await taskService.create({ title: title.trim(), completed: false });
      // Optimistic update: add to top of list immediately
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // ── TOGGLE COMPLETE ──────────────────────────────────────────
  const toggleTask = useCallback(async (task) => {
    // Optimistic update: flip locally first
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await taskService.update(task.id, { ...task, completed: !task.completed });
    } catch (err) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      );
      setError(err.message);
    }
  }, []);

  // ── EDIT TITLE ───────────────────────────────────────────────
  const editTask = useCallback(async (task, newTitle) => {
    if (!newTitle?.trim() || newTitle.trim() === task.title) return;
    const trimmed = newTitle.trim();
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, title: trimmed } : t))
    );
    try {
      await taskService.update(task.id, { ...task, title: trimmed });
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: task.title } : t))
      );
      setError(err.message);
    }
  }, []);

  // ── DELETE ───────────────────────────────────────────────────
  const deleteTask = useCallback(async (id) => {
    const prev = tasks;
    setTasks((t) => t.filter((task) => task.id !== id));
    try {
      await taskService.delete(id);
    } catch (err) {
      setTasks(prev);
      setError(err.message);
    }
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    clearError,
    fetchTasks,
    createTask,
    toggleTask,
    editTask,
    deleteTask,
  };
}
