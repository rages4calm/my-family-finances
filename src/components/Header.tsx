import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, Bell, Settings, User, Search } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';
import SettingsPanel from './SettingsPanel';
import AccountPanel from './AccountPanel';
import { authService } from '../services/authService';
import { SaveStatusIndicator } from './SaveStatusIndicator';

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
}

const HeaderContainer = styled.header`
  height: 70px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.boxShadow};
  position: relative;
  z-index: 50;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const IconButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.error};
  border-radius: 50%;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserRole = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);  
  const [showAccount, setShowAccount] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, [showAccount]); // Refresh when account panel opens

  const closeAllPanels = () => {
    setShowNotifications(false);
    setShowSettings(false);
    setShowAccount(false);
  };

  const toggleNotifications = () => {
    closeAllPanels();
    setShowNotifications(true);
  };

  const toggleSettings = () => {
    closeAllPanels();
    setShowSettings(true);
  };

  const toggleAccount = () => {
    closeAllPanels();
    setShowAccount(true);
  };

  const handleProfileUpdate = () => {
    // Refresh current user data when profile is updated
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <Menu size={20} />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Search expenses, family members, providers..." 
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <SaveStatusIndicator />
        
        <IconButton onClick={toggleNotifications}>
          <Bell size={20} />
          <NotificationBadge />
        </IconButton>
        
        <IconButton onClick={toggleSettings}>
          <Settings size={20} />
        </IconButton>

        <UserProfile onClick={toggleAccount}>
          <Avatar>
            {currentUser?.profile?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
          </Avatar>
          <UserInfo>
            <UserName>{currentUser?.profile?.name || 'User'}</UserName>
            <UserRole>{currentUser?.role === 'admin' ? 'Administrator' : 'User'}</UserRole>
          </UserInfo>
        </UserProfile>
      </RightSection>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      <AccountPanel 
        isOpen={showAccount} 
        onClose={() => setShowAccount(false)}
        onLogout={onLogout}
        onProfileUpdate={handleProfileUpdate}
      />
    </HeaderContainer>
  );
};

export default Header;