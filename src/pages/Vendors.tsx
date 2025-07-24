import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
import { databaseService, Vendor } from '../database/databaseService';
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

const VendorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const VendorCard = styled.div`
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

const VendorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const VendorName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const VendorActions = styled.div`
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

const VendorInfo = styled.div`
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
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.error};
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

interface VendorsProps {
  onNavigate: (page: string) => void;
}

const Vendors: React.FC<VendorsProps> = ({ onNavigate }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm]);

  const loadVendors = async () => {
    try {
      const result = await databaseService.getAllVendors();
      setVendors(result);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      toast.error('Failed to load vendors');
    }
  };

  const filterVendors = () => {
    if (!searchTerm) {
      setFilteredVendors(vendors);
      return;
    }

    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone?.includes(searchTerm)
    );

    setFilteredVendors(filtered);
  };

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name,
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        city: vendor.city || '',
        state: vendor.state || '',
        zip: vendor.zip || ''
      });
    } else {
      setEditingVendor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  const handleSaveVendor = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Vendor name is required');
      return;
    }

    try {
      let success = false;
      
      if (editingVendor) {
        success = await databaseService.updateVendor(editingVendor.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim()
        });
        if (success) {
          toast.success('Vendor updated successfully');
        }
      } else {
        success = await databaseService.createVendor({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim()
        });
        if (success) {
          toast.success('Vendor created successfully');
        }
      }
      
      if (success) {
        await loadVendors();
        handleCloseModal();
      } else {
        toast.error('Failed to save vendor');
      }
    } catch (error) {
      toast.error('Failed to save vendor');
    }
  };

  const handleDeleteVendor = async (vendor: Vendor) => {
    if (window.confirm(`Are you sure you want to delete "${vendor.name}"?`)) {
      try {
        const success = await databaseService.deleteVendor(vendor.id);
        if (success) {
          toast.success('Vendor deleted successfully');
          await loadVendors();
        } else {
          toast.error('Failed to delete vendor');
        }
      } catch (error) {
        console.error('Failed to delete vendor:', error);
        toast.error('Failed to delete vendor');
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
        <PageTitle>Payees & Services</PageTitle>
        <SearchInput
          type="text"
          placeholder="Search payees & services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          Add Payee/Service
        </Button>
      </PageHeader>

      <VendorsGrid>
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id}>
            <VendorHeader>
              <VendorName>{vendor.name}</VendorName>
              <VendorActions>
                <IconButton onClick={() => handleOpenModal(vendor)}>
                  <Edit size={16} />
                </IconButton>
                <IconButton onClick={() => handleDeleteVendor(vendor)}>
                  <Trash2 size={16} />
                </IconButton>
              </VendorActions>
            </VendorHeader>

            <VendorInfo>
              {vendor.email && (
                <InfoItem>
                  <Mail />
                  <span>{vendor.email}</span>
                </InfoItem>
              )}
              {vendor.phone && (
                <InfoItem>
                  <Phone />
                  <span>{vendor.phone}</span>
                </InfoItem>
              )}
              {vendor.address && (
                <InfoItem>
                  <MapPin />
                  <span>
                    {vendor.address}
                    {vendor.city && `, ${vendor.city}`}
                    {vendor.state && `, ${vendor.state}`}
                    {vendor.zip && ` ${vendor.zip}`}
                  </span>
                </InfoItem>
              )}
            </VendorInfo>

            <Balance positive={vendor.balance <= 0}>
              Balance: {formatCurrency(Math.abs(vendor.balance))} {vendor.balance > 0 ? 'owed to vendor' : 'owed by vendor'}
            </Balance>
          </VendorCard>
        ))}
      </VendorsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingVendor ? 'Edit Payee/Service' : 'Add New Payee/Service'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>

          <FormGrid>
            <FormGroup fullWidth>
              <Label>Payee/Service Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter vendor name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vendor@example.com"
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
            <Button variant="primary" onClick={handleSaveVendor}>
              {editingVendor ? 'Update' : 'Create'} Payee/Service
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Vendors;