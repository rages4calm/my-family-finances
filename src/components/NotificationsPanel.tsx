import React, { useState } from 'react';
import styled from 'styled-components';
import { Bell, X, CheckCircle, AlertTriangle, Info, Calendar, DollarSign, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'expense' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsPanelProps {
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
  right: ${props => props.isOpen ? '20px' : '-400px'};
  width: 380px;
  max-height: 600px;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const NotificationList = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ read: boolean }>`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.read ? 'transparent' : `${props.theme.colors.primary}08`};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div<{ type: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success + '20';
      case 'warning': return props.theme.colors.warning + '20';
      case 'expense': return props.theme.colors.error + '20';
      case 'reminder': return props.theme.colors.primary + '20';
      default: return props.theme.colors.secondary + '20';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'expense': return props.theme.colors.error;
      case 'reminder': return props.theme.colors.primary;
      default: return props.theme.colors.secondary;
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const NotificationMessage = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={18} />;
    case 'warning':
      return <AlertTriangle size={18} />;
    case 'expense':
      return <DollarSign size={18} />;
    case 'reminder':
      return <Calendar size={18} />;
    default:
      return <Info size={18} />;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // No preloaded notifications - start with empty array

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <Panel isOpen={isOpen}>
        <Header>
          <Title>
            Notifications
            {unreadCount > 0 && (
              <span style={{ 
                marginLeft: '8px', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                borderRadius: '12px', 
                padding: '2px 8px', 
                fontSize: '12px' 
              }}>
                {unreadCount}
              </span>
            )}
          </Title>
          <HeaderActions>
            {notifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <ClearButton onClick={handleMarkAllAsRead} title="Mark all as read">
                    <CheckCircle size={14} />
                  </ClearButton>
                )}
                <ClearButton onClick={handleClearAll} title="Clear all notifications">
                  <Trash2 size={14} />
                </ClearButton>
              </>
            )}
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </HeaderActions>
        </Header>
        
        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>
              <Bell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No notifications yet</p>
            </EmptyState>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                read={notification.read}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <NotificationIcon type={notification.type}>
                  {getNotificationIcon(notification.type)}
                </NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationTime>{formatTime(notification.timestamp)}</NotificationTime>
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      </Panel>
    </>
  );
};

export default NotificationsPanel;