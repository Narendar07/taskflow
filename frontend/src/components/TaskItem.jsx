// src/components/TaskItem.jsx
import { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: border-color ${({ theme }) => theme.transitions.base},
              box-shadow ${({ theme }) => theme.transitions.base};
  animation: ${slideIn} 220ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  ${({ $completed }) => $completed && css`
    background: ${({ theme }) => theme.colors.bg};
  `}
`;

const Checkbox = styled.button`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ $checked, theme }) =>
    $checked ? theme.colors.success : theme.colors.border};
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.success : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ $checked, theme }) =>
      $checked ? theme.colors.success : theme.colors.accent};
    transform: scale(1.1);
  }

  svg {
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }
`;

const TitleArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.span`
  font-size: 15px;
  font-weight: 400;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.textMuted : theme.colors.text};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: block;
  word-break: break-word;
  cursor: text;

  &:hover {
    color: ${({ $completed, theme }) =>
      $completed ? theme.colors.textMuted : theme.colors.accent};
  }
`;

const EditInput = styled.input`
  width: 100%;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.accent};
  padding-bottom: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${Item}:hover & {
    opacity: 1;
  }
`;

const ActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.textMuted};
  transition: background ${({ theme }) => theme.transitions.fast},
              color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $danger, theme }) => $danger ? theme.colors.dangerLight : theme.colors.accentLight};
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.accent};
  }
`;

const EditHint = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 3px;
  display: block;
`;

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const startEdit = () => {
    if (task.completed) return;
    setEditValue(task.title);
    setIsEditing(true);
  };

  const saveEdit = () => {
    onEdit(task, editValue);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <Item $completed={task.completed}>
      {/* Checkbox */}
      <Checkbox $checked={task.completed} onClick={() => onToggle(task)} title="Toggle complete">
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Checkbox>

      {/* Title / Edit input */}
      <TitleArea>
        {isEditing ? (
          <>
            <EditInput
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
            />
            <EditHint>Enter to save · Esc to cancel</EditHint>
          </>
        ) : (
          <Title $completed={task.completed} onClick={startEdit} title="Click to edit">
            {task.title}
          </Title>
        )}
      </TitleArea>

      {/* Actions */}
      {!isEditing && (
        <Actions>
          {!task.completed && (
            <ActionBtn onClick={startEdit} title="Edit task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </ActionBtn>
          )}
          <ActionBtn $danger onClick={() => onDelete(task.id)} title="Delete task">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </ActionBtn>
        </Actions>
      )}
    </Item>
  );
}
