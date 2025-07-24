import React, { useState } from 'react';
import styled from 'styled-components';
import { Target, TrendingUp, Calendar, DollarSign, Plus, Edit, Trash2, Gift } from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'vacation' | 'emergency' | 'education' | 'home' | 'car' | 'other';
  color: string;
  emoji: string;
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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
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

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const GoalCard = styled.div<{ color: string }>`
  background: linear-gradient(135deg, ${props => props.color}15, ${props => props.color}08);
  border: 1px solid ${props => props.color}30;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.boxShadowLg};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color};
  }
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const GoalInfo = styled.div`
  flex: 1;
`;

const GoalEmoji = styled.div`
  font-size: 32px;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const GoalName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const GoalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ProgressSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Progress = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}dd);
  transition: width 0.5s ease;
  border-radius: 6px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const CurrentAmount = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const TargetAmount = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressPercentage = styled.div<{ color: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color};
`;

const TimeRemaining = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  background: ${props => props.theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.background};
  }
`;

const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 0,
      targetDate: '2024-12-31',
      category: 'emergency',
      color: '#ef4444',
      emoji: '🚨'
    },
    {
      id: '2',
      name: 'Family Vacation',
      targetAmount: 5000,
      currentAmount: 0,
      targetDate: '2024-08-15',
      category: 'vacation',
      color: '#3b82f6',
      emoji: '🏖️'
    },
    {
      id: '3',
      name: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 0,
      targetDate: '2025-03-01',
      category: 'car',
      color: '#10b981',
      emoji: '🚗'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const calculateTimeRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'emergency' as SavingsGoal['category'],
    color: '#ef4444',
    emoji: '🚨'
  });

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'emergency',
      color: '#ef4444',
      emoji: '🚨'
    });
    setIsModalOpen(true);
  };

  const handleEditGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate,
        category: goal.category,
        color: goal.color,
        emoji: goal.emoji
      });
      setIsModalOpen(true);
    }
  };

  const handleSaveGoal = () => {
    if (!formData.name || !formData.targetAmount) return;

    const newGoal: SavingsGoal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
      category: formData.category,
      color: formData.color,
      emoji: formData.emoji
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
    } else {
      setGoals([...goals, newGoal]);
    }

    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const categoryOptions = [
    { value: 'emergency', label: 'Emergency Fund', emoji: '🚨', color: '#ef4444' },
    { value: 'vacation', label: 'Vacation', emoji: '🏖️', color: '#3b82f6' },
    { value: 'education', label: 'Education', emoji: '🎓', color: '#8b5cf6' },
    { value: 'home', label: 'Home', emoji: '🏠', color: '#10b981' },
    { value: 'car', label: 'Car', emoji: '🚗', color: '#f59e0b' },
    { value: 'other', label: 'Other', emoji: '💰', color: '#06b6d4' }
  ] as const;

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      setGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <Target size={28} />
          Family Savings Goals
        </Title>
        <AddButton onClick={handleAddGoal}>
          <Plus size={16} />
          Add Goal
        </AddButton>
      </Header>

      {goals.length === 0 ? (
        <EmptyState>
          <Gift size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>No savings goals yet. Start by adding your first goal!</p>
        </EmptyState>
      ) : (
        <GoalsGrid>
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const timeRemaining = calculateTimeRemaining(goal.targetDate);
            
            return (
              <GoalCard key={goal.id} color={goal.color}>
                <GoalHeader>
                  <GoalInfo>
                    <GoalEmoji>{goal.emoji}</GoalEmoji>
                    <GoalName>{goal.name}</GoalName>
                  </GoalInfo>
                  <GoalActions>
                    <ActionButton onClick={() => handleEditGoal(goal.id)}>
                      <Edit size={14} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 size={14} />
                    </ActionButton>
                  </GoalActions>
                </GoalHeader>

                <ProgressSection>
                  <ProgressBar>
                    <Progress percentage={progress} color={goal.color} />
                  </ProgressBar>
                  
                  <ProgressStats>
                    <AmountInfo>
                      <CurrentAmount>{formatCurrency(goal.currentAmount)}</CurrentAmount>
                      <TargetAmount>of {formatCurrency(goal.targetAmount)}</TargetAmount>
                    </AmountInfo>
                    <ProgressPercentage color={goal.color}>
                      {progress.toFixed(0)}%
                    </ProgressPercentage>
                  </ProgressStats>
                </ProgressSection>

                <TimeRemaining>
                  <Calendar size={12} />
                  <span>{timeRemaining} remaining</span>
                </TimeRemaining>
              </GoalCard>
            );
          })}
        </GoalsGrid>
      )}

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Goal Name *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter goal name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onChange={(e) => {
                const category = e.target.value as SavingsGoal['category'];
                const option = categoryOptions.find(opt => opt.value === category);
                setFormData({ 
                  ...formData, 
                  category,
                  color: option?.color || '#ef4444',
                  emoji: option?.emoji || '🚨'
                });
              }}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Target Amount ($) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="0.00"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Current Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup>
            <Label>Target Date</Label>
            <Input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </FormGroup>

          <ModalActions>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveGoal}>
              {editingGoal ? 'Update' : 'Create'} Goal
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SavingsGoals;