// src/components/TaskList.jsx
import styled from 'styled-components';
import TaskItem from './TaskItem';

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.4;
`;

const EmptyText = styled.p`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-style: italic;
`;

const EmptySubtext = styled.p`
  font-size: 13px;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EMPTY_MESSAGES = {
  all: { icon: '✦', text: 'Nothing here yet', sub: 'Add your first task above.' },
  active: { icon: '✓', text: 'All caught up', sub: 'No active tasks remaining.' },
  completed: { icon: '○', text: 'Nothing done yet', sub: 'Complete some tasks to see them here.' },
};

export default function TaskList({ tasks, filter, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    const msg = EMPTY_MESSAGES[filter] || EMPTY_MESSAGES.all;
    return (
      <EmptyState>
        <EmptyIcon>{msg.icon}</EmptyIcon>
        <EmptyText>{msg.text}</EmptyText>
        <EmptySubtext>{msg.sub}</EmptySubtext>
      </EmptyState>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
