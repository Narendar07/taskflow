// src/components/LoadingSpinner.jsx
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Ring = styled.div`
  width: 32px;
  height: 32px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 700ms linear infinite;
`;

const Label = styled.p`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export default function LoadingSpinner() {
  return (
    <Wrapper>
      <Ring />
      <Label>Loading</Label>
    </Wrapper>
  );
}
