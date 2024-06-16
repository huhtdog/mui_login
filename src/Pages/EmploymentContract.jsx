import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const EmploymentContracts = () => {
  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [contracts, setContracts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [formValues, setFormValues] = useState({
    staff_number: '',
    hours_worked_per_week: '',
    contract_type: '',
    payment_type: '',
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('employmentcontract')
        .select('*');
      if (error) {
        throw error;
      }
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error.message);
    }
  };

  const handleDialogOpen = (contract) => {
    setSelectedContract(contract);
    setOpenDialog(true);
    if (contract) {
      setFormValues({
        staff_number: contract.staff_number,
        hours_worked_per_week: contract.hours_worked_per_week,
        contract_type: contract.contract_type,
        payment_type: contract.payment_type,
      });
    } else {
      setFormValues({
        staff_number: '',
        hours_worked_per_week: '',
        contract_type: '',
        payment_type: '',
      });
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      if (!selectedContract) {
        // Create new contract
        const { data, error } = await supabase
          .from('employmentcontract')
          .insert([formValues]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing contract
        const { data, error } = await supabase
          .from('employmentcontract')
          .update(formValues)
          .eq('contract_id', selectedContract.contract_id);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      fetchContracts();
      clearForm();
    } catch (error) {
      console.error('Error saving contract:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      staff_number: '',
      hours_worked_per_week: '',
      contract_type: '',
      payment_type: '',
    });
  };

  const handleDelete = async (contract) => {
    try {
      const { data, error } = await supabase
        .from('employmentcontract')
        .delete()
        .eq('contract_id', contract.contract_id);
      if (error) {
        throw error;
      }
      fetchContracts();
    } catch (error) {
      console.error('Error deleting contract:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employment Contracts
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Contract
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Contract ID</TableCell>
            <TableCell>Staff Number</TableCell>
            <TableCell>Hours Worked Per Week</TableCell>
            <TableCell>Contract Type</TableCell>
            <TableCell>Payment Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.contract_id}>
              <TableCell>{contract.contract_id}</TableCell>
              <TableCell>{contract.staff_number}</TableCell>
              <TableCell>{contract.hours_worked_per_week}</TableCell>
              <TableCell>{contract.contract_type}</TableCell>
              <TableCell>{contract.payment_type}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(contract)} aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(contract)} aria-label="delete">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedContract ? 'Edit Contract' : 'Add Contract'}</DialogTitle>
        <DialogContent>
          <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth />
          <TextField label="Hours Worked Per Week" name="hours_worked_per_week" value={formValues.hours_worked_per_week} onChange={handleChange} fullWidth />
          <TextField label="Contract Type" name="contract_type" value={formValues.contract_type} onChange={handleChange} fullWidth />
          <TextField label="Payment Type" name="payment_type" value={formValues.payment_type} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmploymentContracts;
