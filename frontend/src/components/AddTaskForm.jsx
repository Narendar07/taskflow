// src/components/AddTaskForm.jsx
import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.base},
              box-shadow ${({ theme }) => theme.transitions.base};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const AddButton = styled.button`
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: white;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background ${({ theme }) => theme.transitions.fast},
              transform ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function AddTaskForm({ onAdd }) {
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    await onAdd(value);
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Add a new task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <AddButton type="submit" disabled={!value.trim()}>
        Add Task
      </AddButton>
    </Form>
  );
}
