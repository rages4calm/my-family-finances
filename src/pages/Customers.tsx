import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin, DollarSign, Briefcase, Users } from 'lucide-react';
import { databaseService, Customer } from '../database/databaseService';
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
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SearchInput = styled.input`
  width: 300px;
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

const CustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const CustomerCard = styled.div`
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

const CustomerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CustomerName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CustomerActions = styled.div`
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

const CustomerInfo = styled.div`
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

const Balance = styled.div<{ positive?: boolean }>`
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.text};
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  margin-bottom: ${props => props.theme.spacing.md};
  ${props => props.fullWidth && 'grid-column: 1 / -1;'}
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

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Checkbox = styled.input`
  margin-right: ${props => props.theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

interface CustomersProps {
  onNavigate: (page: string) => void;
}

const Customers: React.FC<CustomersProps> = ({ onNavigate }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    weekly_income: '',
    job_title: '',
    is_family_member: false
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = async () => {
    try {
      const result = await databaseService.getAllCustomers();
      setCustomers(result);
    } catch (error) {
      console.error('Failed to load customers:', error);
      toast.error('Failed to load customers');
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
    );

    setFilteredCustomers(filtered);
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || '',
        weekly_income: customer.weekly_income?.toString() || '',
        job_title: customer.job_title || '',
        is_family_member: customer.is_family_member || false
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        weekly_income: '',
        job_title: '',
        is_family_member: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      let success = false;
        
      if (editingCustomer) {
        success = await databaseService.updateCustomer(editingCustomer.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          weekly_income: parseFloat(formData.weekly_income) || 0,
          job_title: formData.job_title.trim(),
          is_family_member: formData.is_family_member
        });
        if (success) {
          toast.success('Family member updated successfully');
        }
      } else {
        success = await databaseService.createCustomer({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          weekly_income: parseFloat(formData.weekly_income) || 0,
          job_title: formData.job_title.trim(),
          is_family_member: formData.is_family_member
        });
        if (success) {
          toast.success('Family member added successfully');
        }
      }

      if (success) {
        await loadCustomers();
        handleCloseModal();
      } else {
        toast.error('Failed to save customer');
      }
    } catch (error) {
      toast.error('Failed to save customer');
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      try {
        const success = await databaseService.deleteCustomer(customer.id);
        if (success) {
          toast.success('Customer deleted successfully');
          await loadCustomers();
        } else {
          toast.error('Failed to delete customer');
        }
      } catch (error) {
        console.error('Failed to delete customer:', error);
        toast.error('Failed to delete customer');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <Users size={32} />
          Family Members
        </PageTitle>
        <SearchInput
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          Add Family Member
        </Button>
      </PageHeader>

      <CustomersGrid>
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id}>
            <CustomerHeader>
              <CustomerName>{customer.name}</CustomerName>
              <CustomerActions>
                <IconButton onClick={() => handleOpenModal(customer)}>
                  <Edit size={16} />
                </IconButton>
                <IconButton onClick={() => handleDeleteCustomer(customer)}>
                  <Trash2 size={16} />
                </IconButton>
              </CustomerActions>
            </CustomerHeader>

            <CustomerInfo>
              {customer.job_title && (
                <InfoItem>
                  <Briefcase />
                  <span>{customer.job_title}</span>
                </InfoItem>
              )}
              {customer.weekly_income && customer.weekly_income > 0 && (
                <InfoItem>
                  <DollarSign />
                  <span>
                    {formatCurrency(customer.weekly_income)}/week 
                    <small style={{color: '#10b981', marginLeft: '8px'}}>
                      ({formatCurrency(customer.weekly_income * 4.33)}/month)
                    </small>
                  </span>
                </InfoItem>
              )}
              {customer.email && (
                <InfoItem>
                  <Mail />
                  <span>{customer.email}</span>
                </InfoItem>
              )}
              {customer.phone && (
                <InfoItem>
                  <Phone />
                  <span>{customer.phone}</span>
                </InfoItem>
              )}
              {customer.address && (
                <InfoItem>
                  <MapPin />
                  <span>
                    {customer.address}
                    {customer.city && `, ${customer.city}`}
                    {customer.state && `, ${customer.state}`}
                    {customer.zip && ` ${customer.zip}`}
                  </span>
                </InfoItem>
              )}
            </CustomerInfo>

            <Balance positive={customer.balance >= 0}>
              Balance: {formatCurrency(customer.balance)}
            </Balance>
          </CustomerCard>
        ))}
      </CustomersGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingCustomer ? 'Edit Family Member' : 'Add New Family Member'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>

          <FormGrid>
            <FormGroup fullWidth>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={formData.is_family_member}
                  onChange={(e) => setFormData({ ...formData, is_family_member: e.target.checked })}
                />
                This person is a family member who contributes income
              </CheckboxLabel>
            </FormGroup>

            <FormGroup fullWidth>
              <Label>Full Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter family member name"
                required
              />
            </FormGroup>

            {formData.is_family_member && (
              <>
                <FormGroup>
                  <Label>Job Title</Label>
                  <Input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    placeholder="e.g., Software Engineer, Teacher"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Weekly Income ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.weekly_income}
                    onChange={(e) => setFormData({ ...formData, weekly_income: e.target.value })}
                    placeholder="0.00"
                  />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </FormGroup>

            <FormGroup fullWidth>
              <Label>Address</Label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </FormGroup>

            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </FormGroup>

            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
              />
            </FormGroup>

            <FormGroup>
              <Label>ZIP Code</Label>
              <Input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="12345"
              />
            </FormGroup>
          </FormGrid>

          <ModalActions>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveCustomer}>
              {editingCustomer ? 'Update' : 'Create'} Family Member
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Customers;