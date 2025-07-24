import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Save, Check, Loader2 } from 'lucide-react';
import { useSaveStatus } from '../contexts/SaveStatusContext';

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
`;

const SavingStatus = styled(StatusContainer)`
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  
  svg {
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const SavedStatus = styled(StatusContainer)`
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #34d399;
`;

const UnsavedStatus = styled(StatusContainer)`
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #f87171;
`;

const DefaultStatus = styled(StatusContainer)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

const formatLastSaved = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

export const SaveStatusIndicator: React.FC = () => {
  const { saveStatus } = useSaveStatus();

  if (saveStatus.isSaving) {
    return (
      <SavingStatus>
        <Loader2 size={14} />
        Saving...
      </SavingStatus>
    );
  }

  if (saveStatus.hasUnsavedChanges) {
    return (
      <UnsavedStatus>
        <Save size={14} />
        Unsaved changes
      </UnsavedStatus>
    );
  }

  if (saveStatus.lastSaved) {
    return (
      <SavedStatus>
        <Check size={14} />
        Saved {formatLastSaved(saveStatus.lastSaved)}
      </SavedStatus>
    );
  }

  return (
    <DefaultStatus>
      <Check size={14} />
      All saved
    </DefaultStatus>
  );
};