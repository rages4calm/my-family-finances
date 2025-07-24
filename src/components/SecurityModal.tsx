import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Shield, Eye, EyeOff, Lock, Save } from 'lucide-react';
import { authService } from '../services/authService';
import { useSaveStatus } from '../contexts/SaveStatusContext';
import toast from 'react-hot-toast';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.boxShadowLg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-right: 50px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  transition: border-color 0.2s ease;
  background: ${props => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const PasswordStrength = styled.div<{ strength: number }>`
  margin-top: 8px;
  height: 4px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.strength}%;
    background: ${props => {
      if (props.strength < 25) return '#ef4444';
      if (props.strength < 50) return '#f59e0b';
      if (props.strength < 75) return '#3b82f6';
      return '#10b981';
    }};
    transition: width 0.3s ease, background-color 0.3s ease;
  }
`;

const PasswordHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const SecurityFeatures = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} 0;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const CheckIcon = styled.div`
  width: 16px;
  height: 16px;
  background: ${props => props.theme.colors.success};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xl};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.background};
    transform: translateY(-1px);
  }
`;

const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const { autoSave } = useSaveStatus();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    if (!formData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (!formData.newPassword) {
      toast.error('New password is required');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (calculatePasswordStrength(formData.newPassword) < 50) {
      toast.error('Password is too weak. Please choose a stronger password.');
      return;
    }

    await autoSave(async () => {
      const result = await authService.changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        onClose();
      } else {
        throw new Error(result.error || 'Failed to update password');
      }
    }, 'password change');
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Shield size={24} />
            Security Settings
          </Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <FormGrid>
          <FormGroup>
            <Label>
              <Lock size={16} />
              Current Password *
            </Label>
            <PasswordInputContainer>
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter your current password"
                required
              />
              <TogglePasswordButton
                type="button"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </TogglePasswordButton>
            </PasswordInputContainer>
          </FormGroup>

          <FormGroup>
            <Label>
              <Lock size={16} />
              New Password *
            </Label>
            <PasswordInputContainer>
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter your new password"
                required
              />
              <TogglePasswordButton
                type="button"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </TogglePasswordButton>
            </PasswordInputContainer>
            {formData.newPassword && (
              <>
                <PasswordStrength strength={passwordStrength} />
                <PasswordHint>
                  Password strength: {
                    passwordStrength < 25 ? 'Very Weak' :
                    passwordStrength < 50 ? 'Weak' :
                    passwordStrength < 75 ? 'Good' : 'Strong'
                  }
                </PasswordHint>
              </>
            )}
          </FormGroup>

          <FormGroup>
            <Label>
              <Lock size={16} />
              Confirm New Password *
            </Label>
            <PasswordInputContainer>
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your new password"
                required
              />
              <TogglePasswordButton
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </TogglePasswordButton>
            </PasswordInputContainer>
          </FormGroup>
        </FormGrid>

        <SecurityFeatures>
          <FeatureTitle>Security Features Active</FeatureTitle>
          <FeatureList>
            <FeatureItem>
              <CheckIcon>✓</CheckIcon>
              Data encryption for sensitive financial information
            </FeatureItem>
            <FeatureItem>
              <CheckIcon>✓</CheckIcon>
              Automatic session timeout after inactivity
            </FeatureItem>
            <FeatureItem>
              <CheckIcon>✓</CheckIcon>
              Local data storage (your data never leaves your device)
            </FeatureItem>
            <FeatureItem>
              <CheckIcon>✓</CheckIcon>
              Secure backup and restore functionality
            </FeatureItem>
          </FeatureList>
        </SecurityFeatures>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save size={16} />
            Update Password
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default SecurityModal;