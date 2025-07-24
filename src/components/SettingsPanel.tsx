import React from 'react';
import styled from 'styled-components';
import { X, Palette, Bell, Shield, Database, DollarSign, Calendar, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { useSaveStatus } from '../contexts/SaveStatusContext';
import { useDebounce } from '../hooks/useDebounce';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
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
  right: ${props => props.isOpen ? '20px' : '-450px'};
  width: 420px;
  max-height: 700px;
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
  background: ${props => props.theme.colors.background};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
`;

const SettingSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
`;

const SettingName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
`;

const SettingDescription = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.border};
  transition: .4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  width: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: ${props => props.theme.spacing.lg};
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useTheme();
  const { autoSave } = useSaveStatus();

  const handleToggle = async (key: string) => {
    const newValue = !settings[key as keyof typeof settings];
    updateSettings({
      [key]: newValue
    });

    // Auto-save the setting change
    await autoSave(async () => {
      // Settings are already saved by updateSettings, just simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
    }, `${key} setting`);
  };

  const handleInputChange = async (key: string, value: string) => {
    updateSettings({
      [key]: value
    });

    // Auto-save the setting change with a small delay
    setTimeout(async () => {
      await autoSave(async () => {
        // Settings are already saved by updateSettings, just simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
      }, `${key} setting`);
    }, 500); // Delay to avoid too many saves while typing
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <Panel isOpen={isOpen}>
        <Header>
          <Title>Family Finance Settings</Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>
        
        <Content>
          <SettingSection>
            <SectionHeader>
              <SectionIcon>
                <Palette size={16} />
              </SectionIcon>
              <SectionTitle>Appearance</SectionTitle>
            </SectionHeader>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Dark Mode</SettingName>
                <SettingDescription>Switch to dark theme for easier viewing</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Compact View</SettingName>
                <SettingDescription>Show more information in less space</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.compactView}
                  onChange={() => handleToggle('compactView')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
          </SettingSection>
          
          <SettingSection>
            <SectionHeader>
              <SectionIcon>
                <Bell size={16} />
              </SectionIcon>
              <SectionTitle>Notifications</SectionTitle>
            </SectionHeader>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Expense Alerts</SettingName>
                <SettingDescription>Get notified about unusual spending patterns</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.expenseAlerts}
                  onChange={() => handleToggle('expenseAlerts')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Bill Reminders</SettingName>
                <SettingDescription>Remind me when bills are due</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.billReminders}
                  onChange={() => handleToggle('billReminders')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Budget Warnings</SettingName>
                <SettingDescription>Alert when approaching budget limits</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.budgetWarnings}
                  onChange={() => handleToggle('budgetWarnings')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
          </SettingSection>
          
          <SettingSection>
            <SectionHeader>
              <SectionIcon>
                <DollarSign size={16} />
              </SectionIcon>
              <SectionTitle>Financial Settings</SectionTitle>
            </SectionHeader>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Currency</SettingName>
                <SettingDescription>Default currency for transactions</SettingDescription>
              </SettingLabel>
              <Select 
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
              </Select>
            </SettingItem>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Monthly Budget</SettingName>
                <SettingDescription>Your family's monthly spending limit</SettingDescription>
              </SettingLabel>
              <Input 
                type="number"
                value={settings.monthlyBudget}
                onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
              />
            </SettingItem>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Budget Period</SettingName>
                <SettingDescription>How often to reset budget tracking</SettingDescription>
              </SettingLabel>
              <Select 
                value={settings.budgetPeriod}
                onChange={(e) => handleInputChange('budgetPeriod', e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </SettingItem>
          </SettingSection>
          
          <SettingSection>
            <SectionHeader>
              <SectionIcon>
                <Shield size={16} />
              </SectionIcon>
              <SectionTitle>Privacy & Security</SectionTitle>
            </SectionHeader>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Auto Backup</SettingName>
                <SettingDescription>Automatically backup your financial data</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.autoBackup}
                  onChange={() => handleToggle('autoBackup')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
            
            <SettingItem>
              <SettingLabel>
                <SettingName>Data Encryption</SettingName>
                <SettingDescription>Encrypt sensitive financial information</SettingDescription>
              </SettingLabel>
              <Toggle>
                <ToggleInput 
                  type="checkbox" 
                  checked={settings.dataEncryption}
                  onChange={() => handleToggle('dataEncryption')}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
          </SettingSection>
          
        </Content>
      </Panel>
    </>
  );
};

export default SettingsPanel;