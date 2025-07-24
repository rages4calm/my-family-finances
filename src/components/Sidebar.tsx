import React from 'react';
// Custom navigation system
import styled from 'styled-components';
import { 
  Home, 
  CreditCard, 
  Users,
  Truck,
  Receipt,
  ChevronLeft,
  Building2
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '80px' : '280px'};
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  z-index: 100;
`;

const Header = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 20px;
  font-weight: bold;
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 20px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 101;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: scale(1.1);
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.lg} 0;
`;

const NavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  ${props => props.$active && `
    background: rgba(37, 99, 235, 0.3);
    border-right: 3px solid ${props.theme.colors.primary};
  `}

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.3s ease;
  }
`;

const Footer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`;

const DisabledNavItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: rgba(255, 255, 255, 0.3);
  opacity: 0.5;
  cursor: not-allowed;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.3s ease;
  }
`;

const menuItems = [
  { key: 'dashboard', icon: Home, label: 'Dashboard', enabled: true },
  { key: 'accounts', icon: CreditCard, label: 'Chart of Accounts', enabled: true },
  { key: 'customers', icon: Users, label: 'Customers', enabled: true },
  { key: 'vendors', icon: Truck, label: 'Vendors', enabled: true },
  { key: 'expenses', icon: Receipt, label: 'Expenses', enabled: true }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, currentPage, onNavigate }) => {

  return (
    <SidebarContainer collapsed={collapsed}>
      <CollapseButton onClick={onToggle}>
        <ChevronLeft style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
      </CollapseButton>
      
      <Header>
        <Logo>
          <Building2 size={28} />
          {!collapsed && <span>My Family Finances</span>}
        </Logo>
      </Header>

      <Nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.key;
          
          return (
            <NavItem
              key={item.key}
              href="#"
              $active={isActive}
              title={collapsed ? item.label : ''}
              onClick={(e) => {
                e.preventDefault();
                console.log('Navigating to page:', item.key);
                onNavigate(item.key);
              }}
            >
              <Icon />
              {!collapsed && <span>{item.label}</span>}
            </NavItem>
          );
        })}
      </Nav>

      {!collapsed && (
        <Footer>
          My Family Finances v1.0.0
          <br />
          © 2025 Prewitt Family
          <br /><br />
          <span style={{color: '#10b981', fontSize: '11px'}}>✅ All Features Working!</span>
        </Footer>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;