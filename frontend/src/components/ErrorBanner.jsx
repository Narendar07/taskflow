// src/components/ErrorBanner.jsx
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.dangerLight};
  border: 1px solid ${({ theme }) => theme.colors.danger}33;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 20px;
  animation: ${slideDown} 200ms ease;
`;

const Message = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 500;
`;

const CloseBtn = styled.button`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.danger};
  opacity: 0.6;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover { opacity: 1; }
`;

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <Banner role="alert">
      <Message>⚠ {message}</Message>
      <CloseBtn onClick={onDismiss} aria-label="Dismiss error">✕</CloseBtn>
    </Banner>
  );
}
