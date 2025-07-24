import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

interface BudgetItem {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
}

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.boxShadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const MonthSelector = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SummaryCard = styled.div<{ type: string }>`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => {
    switch (props.type) {
      case 'total': return `linear-gradient(135deg, ${props.theme.colors.primary}20, ${props.theme.colors.primary}10)`;
      case 'spent': return `linear-gradient(135deg, ${props.theme.colors.error}20, ${props.theme.colors.error}10)`;
      case 'remaining': return `linear-gradient(135deg, ${props.theme.colors.success}20, ${props.theme.colors.success}10)`;
      default: return props.theme.colors.background;
    }
  }};
  border-radius: ${props => props.theme.borderRadius};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'total': return props.theme.colors.primary;
      case 'spent': return props.theme.colors.error;
      case 'remaining': return props.theme.colors.success;
      default: return props.theme.colors.secondary;
    }
  }};
`;

const SummaryIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  background: ${props => {
    switch (props.type) {
      case 'total': return props.theme.colors.primary;
      case 'spent': return props.theme.colors.error;
      case 'remaining': return props.theme.colors.success;
      default: return props.theme.colors.secondary;
    }
  }};
  color: white;
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const BudgetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const BudgetItem = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CategoryName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const StatusIcon = styled.div<{ status: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.status) {
      case 'good': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'over': return props.theme.colors.error;
      default: return props.theme.colors.secondary;
    }
  }};
  color: white;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Progress = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const BudgetStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatGroup = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const BudgetTracker: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);

  useEffect(() => {
    // Initialize with empty budget data - users will add their own categories
    const emptyBudget: BudgetItem[] = [];
    
    setBudgetData(emptyBudget);
  }, [selectedMonth]);

  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const getStatusIcon = (percentage: number) => {
    if (percentage < 70) return <CheckCircle size={14} />;
    if (percentage < 90) return <AlertTriangle size={14} />;
    return <TrendingUp size={14} />;
  };

  const getStatus = (percentage: number) => {
    if (percentage < 70) return 'good';
    if (percentage < 90) return 'warning';
    return 'over';
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Container>
      <Header>
        <Title>📊 Family Budget Tracker</Title>
        <MonthSelector 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month} 2025</option>
          ))}
        </MonthSelector>
      </Header>

      <SummaryGrid>
        <SummaryCard type="total">
          <SummaryIcon type="total">
            <Target size={20} />
          </SummaryIcon>
          <SummaryValue>{formatCurrency(totalBudgeted)}</SummaryValue>
          <SummaryLabel>Total Budget</SummaryLabel>
        </SummaryCard>

        <SummaryCard type="spent">
          <SummaryIcon type="spent">
            <TrendingDown size={20} />
          </SummaryIcon>
          <SummaryValue>{formatCurrency(totalSpent)}</SummaryValue>
          <SummaryLabel>Total Spent</SummaryLabel>
        </SummaryCard>

        <SummaryCard type="remaining">
          <SummaryIcon type="remaining">
            <DollarSign size={20} />
          </SummaryIcon>
          <SummaryValue>{formatCurrency(totalRemaining)}</SummaryValue>
          <SummaryLabel>Remaining</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <BudgetList>
        {budgetData.map((item, index) => (
          <BudgetItem key={index}>
            <ItemHeader>
              <CategoryName>{item.category}</CategoryName>
              <StatusIcon status={getStatus(item.percentage)}>
                {getStatusIcon(item.percentage)}
              </StatusIcon>
            </ItemHeader>
            
            <ProgressBar>
              <Progress percentage={item.percentage} color={item.color} />
            </ProgressBar>
            
            <BudgetStats>
              <StatGroup>
                <StatValue>{formatCurrency(item.budgeted)}</StatValue>
                <StatLabel>Budgeted</StatLabel>
              </StatGroup>
              
              <StatGroup>
                <StatValue>{formatCurrency(item.spent)}</StatValue>
                <StatLabel>Spent</StatLabel>
              </StatGroup>
              
              <StatGroup>
                <StatValue>{formatCurrency(item.remaining)}</StatValue>
                <StatLabel>Remaining</StatLabel>
              </StatGroup>
              
              <StatGroup>
                <StatValue>{item.percentage.toFixed(0)}%</StatValue>
                <StatLabel>Used</StatLabel>
              </StatGroup>
            </BudgetStats>
          </BudgetItem>
        ))}
      </BudgetList>
    </Container>
  );
};

export default BudgetTracker;