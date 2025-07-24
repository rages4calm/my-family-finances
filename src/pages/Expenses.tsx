import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, Search, Calendar, Receipt } from 'lucide-react';
import { databaseService, Transaction, Account } from '../database/databaseService';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
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

const ExpensesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ExpenseCard = styled.div`
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

const ExpenseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ExpenseDescription = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

const ExpenseActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ExpenseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ExpenseAmount = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.error};
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
  max-width: 600px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

interface ExpenseWithAccount extends Transaction {
  account_name: string;
}

interface ExpensesProps {
  onNavigate: (page: string) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ onNavigate }) => {
  const [expenses, setExpenses] = useState<ExpenseWithAccount[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseWithAccount[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithAccount | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    account_id: '',
    reference: ''
  });

  useEffect(() => {
    loadExpenses();
    loadAccounts();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm]);

  const loadExpenses = async () => {
    try {
      const result = await databaseService.getExpenseTransactions() as ExpenseWithAccount[];
      setExpenses(result);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      toast.error('Failed to load expenses');
    }
  };

  const loadAccounts = async () => {
    try {
      const result = await databaseService.getExpenseAccounts();
      setAccounts(result);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      toast.error('Failed to load accounts');
    }
  };

  const filterExpenses = () => {
    if (!searchTerm) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredExpenses(filtered);
  };

  const handleOpenModal = (expense?: ExpenseWithAccount) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        date: expense.date,
        account_id: expense.debit_account_id.toString(),
        reference: expense.reference || ''
      });
    } else {
      setEditingExpense(null);
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        account_id: '',
        reference: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = async () => {
    // Validate required fields
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    
    if (!formData.account_id) {
      toast.error('Please select an expense account');
      return;
    }

    try {
      // Find checking account for credit side (assuming first asset account)
      const checkingAccount = await databaseService.getFirstAssetAccount();
      if (!checkingAccount) {
        toast.error('No asset account found');
        return;
      }
      
      if (editingExpense) {
        const success = await databaseService.updateTransaction(editingExpense.id, {
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
          date: formData.date,
          debit_account_id: parseInt(formData.account_id),
          reference: formData.reference.trim()
        });
        
        if (success) {
          toast.success('Expense updated successfully');
        } else {
          toast.error('Failed to update expense');
          return;
        }
      } else {
        const success = await databaseService.createTransaction({
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
          date: formData.date,
          debit_account_id: parseInt(formData.account_id),
          credit_account_id: checkingAccount.id,
          reference: formData.reference.trim(),
          type: 'expense'
        });
        
        if (success) {
          toast.success('Expense created successfully');
        } else {
          toast.error('Failed to create expense');
          return;
        }
      }

      await loadExpenses();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save expense');
    }
  };

  const handleDeleteExpense = async (expense: ExpenseWithAccount) => {
    if (window.confirm(`Are you sure you want to delete this expense: "${expense.description}"?`)) {
      try {
        const success = await databaseService.deleteTransaction(expense.id);
        if (success) {
          toast.success('Expense deleted successfully');
          await loadExpenses();
        } else {
          toast.error('Failed to delete expense');
        }
      } catch (error) {
        console.error('Failed to delete expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Expenses</PageTitle>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          Add Expense
        </Button>
      </PageHeader>

      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FilterBar>

      <ExpensesGrid>
        {filteredExpenses.map((expense) => (
          <ExpenseCard key={expense.id}>
            <ExpenseHeader>
              <ExpenseDescription>{expense.description}</ExpenseDescription>
              <ExpenseActions>
                <IconButton onClick={() => handleOpenModal(expense)}>
                  <Edit size={16} />
                </IconButton>
                <IconButton onClick={() => handleDeleteExpense(expense)}>
                  <Trash2 size={16} />
                </IconButton>
              </ExpenseActions>
            </ExpenseHeader>

            <ExpenseInfo>
              <InfoItem>
                <Calendar />
                <span>{formatDate(expense.date)}</span>
              </InfoItem>
              <InfoItem>
                <Receipt />
                <span>{expense.account_name}</span>
              </InfoItem>
              {expense.reference && (
                <InfoItem>
                  <span>Ref: {expense.reference}</span>
                </InfoItem>
              )}
            </ExpenseInfo>

            <ExpenseAmount>
              -{formatCurrency(expense.amount)}
            </ExpenseAmount>
          </ExpenseCard>
        ))}
      </ExpensesGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Description *</Label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter expense description"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Amount *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Date *</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Expense Account *</Label>
            <Select
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Reference</Label>
            <Input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Invoice number, check number, etc."
            />
          </FormGroup>

          <ModalActions>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveExpense}>
              {editingExpense ? 'Update' : 'Create'} Expense
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Expenses;