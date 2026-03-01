// src/App.jsx
import { useState, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import { useTasks } from './hooks/useTasks';
import AddTaskForm from './components/AddTaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import ErrorBanner from './components/ErrorBanner';
import LoadingSpinner from './components/LoadingSpinner';

// ── Layout ────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  padding: 0 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  width: 100%;
  max-width: 640px;
  padding: 64px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Logo = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(36px, 5vw, 48px);
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 15px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

const Main = styled.main`
  width: 100%;
  max-width: 640px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 20px;
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  letter-spacing: 0.03em;
`;

// ── App ───────────────────────────────────────────────────────
function App() {
  const [filter, setFilter] = useState('all');
  const {
    tasks, loading, error, clearError,
    createTask, toggleTask, editTask, deleteTask,
  } = useTasks();

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':    return tasks.filter((t) => !t.completed);
      case 'completed': return tasks.filter((t) => t.completed);
      default:          return tasks;
    }
  }, [tasks, filter]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Page>
        <Header>
          <Logo>TaskFlow</Logo>
          <Title>What needs doing?</Title>
          <Subtitle>{today}</Subtitle>
        </Header>

        <Main>
          <ErrorBanner message={error} onDismiss={clearError} />
          <AddTaskForm onAdd={createTask} />
          <Divider />
          <FilterBar filter={filter} setFilter={setFilter} tasks={tasks} />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <TaskList
              tasks={filteredTasks}
              filter={filter}
              onToggle={toggleTask}
              onEdit={editTask}
              onDelete={deleteTask}
            />
          )}
        </Main>

        <Footer>Built with React & Spring Boot</Footer>
      </Page>
    </ThemeProvider>
  );
}

export default App;
