// src/components/FilterBar.jsx
import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Filters = styled.div`
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme.colors.border};
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const FilterBtn = styled.button`
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 7px;
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textMuted};
  background: ${({ $active, theme }) => $active ? theme.colors.surface : 'transparent'};
  box-shadow: ${({ $active, theme }) => $active ? theme.shadows.sm : 'none'};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Count = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export default function FilterBar({ filter, setFilter, tasks }) {
  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <Bar>
      <Count>
        {remaining} task{remaining !== 1 ? 's' : ''} remaining
      </Count>
      <Filters>
        {FILTERS.map(({ key, label }) => (
          <FilterBtn
            key={key}
            $active={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </FilterBtn>
        ))}
      </Filters>
    </Bar>
  );
}
