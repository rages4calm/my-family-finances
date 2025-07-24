import React from 'react';
// Navigation handled by parent component
import styled from 'styled-components';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import BudgetTracker from '../components/BudgetTracker';
import SavingsGoals from '../components/SavingsGoals';
import IncomeVsExpensesChart from '../components/IncomeVsExpensesChart';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.boxShadow};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.boxShadowLg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 12px;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.error};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const handleQuickAction = (page: string) => {
    onNavigate(page);
  };

  return (
    <DashboardContainer>
      <PageTitle>Dashboard</PageTitle>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon color="#10b981">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>$0.00</StatValue>
          <StatLabel>Total Income This Month</StatLabel>
          <StatChange positive={true}>
            <TrendingUp size={16} />
            Ready to track your income
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#ef4444">
              <TrendingDown size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>$0.00</StatValue>
          <StatLabel>Total Expenses This Month</StatLabel>
          <StatChange positive={true}>
            <TrendingUp size={16} />
            Start tracking your expenses
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#2563eb">
              <Users size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>Family Members</StatLabel>
          <StatChange positive={true}>
            <Plus size={16} />
            Add family members
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#f59e0b">
              <FileText size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>15</StatValue>
          <StatLabel>Account Categories</StatLabel>
          <StatChange positive={true}>
            <AlertCircle size={16} />
            Ready for your data
          </StatChange>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <ActionButton onClick={() => handleQuickAction('expenses')}>
          <Plus size={16} />
          Record Expense
        </ActionButton>
        <ActionButton onClick={() => handleQuickAction('customers')}>
          <Plus size={16} />
          Add Family Member
        </ActionButton>
        <ActionButton onClick={() => handleQuickAction('vendors')}>
          <Plus size={16} />
          Add Service Provider
        </ActionButton>
        <ActionButton onClick={() => handleQuickAction('accounts')}>
          <Eye size={16} />
          View Accounts
        </ActionButton>
      </QuickActions>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
        <IncomeVsExpensesChart />
        <BudgetTracker />
        <SavingsGoals />
      </div>

      <p style={{textAlign: 'center', marginTop: '3rem', color: '#64748b'}}>
        🏠 <strong>Welcome to My Family Finances!</strong><br/>
        Your personal family financial management system is ready to help you:<br/>
        Track Expenses • Set Budgets • Monitor Savings Goals • Manage Accounts
      </p>
    </DashboardContainer>
  );
};

export default Dashboard;