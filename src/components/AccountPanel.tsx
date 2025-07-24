import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, User, Settings, Shield, LogOut, Edit, Camera, Mail, Phone, MapPin, Crown, Download } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import SecurityModal from './SecurityModal';
import { authService } from '../services/authService';
import { useSaveStatus } from '../contexts/SaveStatusContext';
import toast from 'react-hot-toast';

interface AccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  onProfileUpdate?: () => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 999;
`;

const Panel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 70px;
  right: ${props => props.isOpen ? '20px' : '-400px'};
  width: 380px;
  max-height: 650px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadowLg};
  border: 1px solid ${props => props.theme.colors.border};
  transition: right 0.3s ease;
  z-index: 1000;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryHover} 100%);
  color: white;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius};
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const Content = styled.div`
  max-height: 550px;
  overflow-y: auto;
`;

const ProfileSection = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryHover} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 600;
  border: 4px solid ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.boxShadow};
`;

const EditAvatarButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: ${props => props.theme.colors.success};
  border: 2px solid ${props => props.theme.colors.surface};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.success}dd;
  }
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const UserRole = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const StatsSection = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
`;

const MenuSection = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
  
  &.danger {
    color: ${props => props.theme.colors.error};
  }
`;

const MenuIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.div`
  flex: 1;
`;

const MenuTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
`;

const MenuDescription = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const AccountPanel: React.FC<AccountPanelProps> = ({ isOpen, onClose, onLogout, onProfileUpdate }) => {
  const { autoSave } = useSaveStatus();
  const [userProfile, setUserProfile] = useState({
    name: 'Prewitt Family',
    email: 'family@prewitt.com',
    phone: '',
    address: '',
    role: 'Administrator',
    avatar: 'PF',
    totalExpenses: 0,
    monthlyBudget: 5000.00,
    accountsManaged: 15,
    daysActive: 45
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserProfile(prev => ({
        ...prev,
        name: currentUser.profile.name,
        email: currentUser.profile.email,
        phone: currentUser.profile.phone || '',
        address: currentUser.profile.address || '',
        role: currentUser.role === 'admin' ? 'Administrator' : 'User',
        avatar: currentUser.profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
      }));
    }
  }, [isOpen]);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = async (newProfile: any) => {
    await autoSave(async () => {
      const result = await authService.updateProfile({
        name: newProfile.name,
        email: newProfile.email,
        phone: newProfile.phone,
        address: newProfile.address
      });

      if (result.success) {
        setUserProfile(prev => ({
          ...prev,
          ...newProfile
        }));
        
        // Notify parent component that profile was updated
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    }, 'profile changes');
  };

  const handleChangePassword = () => {
    setShowSecurity(true);
  };

  const handleExportData = () => {
    const data = authService.exportUserData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prewittbook-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Financial data exported successfully!');
    } else {
      toast.error('No data to export');
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      if (onLogout) {
        onLogout();
      }
      onClose();
      toast.success('Successfully signed out');
    }
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <Panel isOpen={isOpen}>
        <Header>
          <Title>Account</Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>
        
        <Content>
          <ProfileSection>
            <AvatarContainer>
              <Avatar>
                {userProfile.avatar}
              </Avatar>
              <EditAvatarButton onClick={handleEditProfile}>
                <Camera size={12} />
              </EditAvatarButton>
            </AvatarContainer>
            
            <UserName>{userProfile.name}</UserName>
            <UserRole>
              <Crown size={14} />
              {userProfile.role}
            </UserRole>
            <UserEmail>{userProfile.email}</UserEmail>
          </ProfileSection>
          
          <StatsSection>
            <StatsGrid>
              <StatItem>
                <StatValue>${userProfile.totalExpenses.toLocaleString()}</StatValue>
                <StatLabel>Total Expenses</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>${userProfile.monthlyBudget.toLocaleString()}</StatValue>
                <StatLabel>Monthly Budget</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{userProfile.accountsManaged}</StatValue>
                <StatLabel>Accounts</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{userProfile.daysActive}</StatValue>
                <StatLabel>Days Active</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsSection>
          
          <MenuSection>
            <MenuItem onClick={handleEditProfile}>
              <MenuIcon>
                <Edit size={18} />
              </MenuIcon>
              <MenuText>
                <MenuTitle>Edit Profile</MenuTitle>
                <MenuDescription>Update your personal information</MenuDescription>
              </MenuText>
            </MenuItem>
            
            <MenuItem onClick={handleChangePassword}>
              <MenuIcon>
                <Shield size={18} />
              </MenuIcon>
              <MenuText>
                <MenuTitle>Security</MenuTitle>
                <MenuDescription>Change password and security settings</MenuDescription>
              </MenuText>
            </MenuItem>
            
            <MenuItem onClick={handleExportData}>
              <MenuIcon>
                <Download size={18} />
              </MenuIcon>
              <MenuText>
                <MenuTitle>Export Data</MenuTitle>
                <MenuDescription>Download your financial data</MenuDescription>
              </MenuText>
            </MenuItem>
            
            <MenuItem onClick={handleSignOut} className="danger">
              <MenuIcon>
                <LogOut size={18} />
              </MenuIcon>
              <MenuText>
                <MenuTitle>Sign Out</MenuTitle>
                <MenuDescription>Sign out of your account</MenuDescription>
              </MenuText>
            </MenuItem>
          </MenuSection>
        </Content>
      </Panel>

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />

      <SecurityModal
        isOpen={showSecurity}
        onClose={() => setShowSecurity(false)}
      />
    </>
  );
};

export default AccountPanel;