import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase service key
const supabase = createClient(supabaseUrl, supabaseKey);

const WardRequisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [formValues, setFormValues] = useState({
    ward_number: null,
    requisitioned_name: '',
    ward_name: '',
    drug_name: '',
    drug_number: null,
    description: '',
    method_of_admin: '',
    cost_per_unit: null,
    quantity_required: null,
    dosage: '',
    required_date: null,
    received_name: '',
    date_received: null,
  });
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    try {
      const { data, error } = await supabase
        .from('wardrequisitions')
        .select('*');
      if (error) {
        throw error;
      }
      setRequisitions(data);
    } catch (error) {
      console.error('Error fetching requisitions:', error.message);
    }
  };

  const handleDialogOpen = (requisition) => {
    setSelectedRequisition(requisition);
    setOpenDialog(true);
    if (requisition) {
      setFormValues({
        ...requisition,
      });
    } else {
      setFormValues({
        ward_number: null,
        requisitioned_name: '',
        ward_name: '',
        drug_name: '',
        drug_number: null,
        description: '',
        method_of_admin: '',
        cost_per_unit: null,
        quantity_required: null,
        dosage: '',
        required_date: null,
        received_name: '',
        date_received: null,
      });
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let { data, error } = {};
      if (!selectedRequisition) {
        // Create new requisition
        ({ data, error } = await supabase
          .from('wardrequisitions')
          .insert([formValues]));
      } else {
        // Update existing requisition
        ({ data, error } = await supabase
          .from('wardrequisitions')
          .update(formValues)
          .eq('requisition_number', selectedRequisition.requisition_number));
      }

      if (error) {
        throw error;
      }

      setOpenDialog(false);
      fetchRequisitions();
      clearForm();
    } catch (error) {
      console.error('Error saving requisition:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      ward_number: null,
      requisitioned_name: '',
      ward_name: '',
      drug_name: '',
      drug_number: null,
      description: '',
      method_of_admin: '',
      cost_per_unit: null,
      quantity_required: null,
      dosage: '',
      required_date: null,
      received_name: '',
      date_received: null,
    });
  };

  const handleDelete = async (requisition) => {
    try {
      const { data, error } = await supabase
        .from('wardrequisitions')
        .delete()
        .eq('requisition_number', requisition.requisition_number);
      if (error) {
        throw error;
      }
      fetchRequisitions();
    } catch (error) {
      console.error('Error deleting requisition:', error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Ward Requisitions
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Requisition
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Requisition Number</TableCell>
            <TableCell>Ward Number</TableCell>
            <TableCell>Requisitioned Name</TableCell>
            <TableCell>Ward Name</TableCell>
            <TableCell>Drug Name</TableCell>
            <TableCell>Drug Number</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Method of Admin</TableCell>
            <TableCell>Cost per Unit</TableCell>
            <TableCell>Quantity Required</TableCell>
            <TableCell>Dosage</TableCell>
            <TableCell>Required Date</TableCell>
            <TableCell>Received Name</TableCell>
            <TableCell>Date Received</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requisitions.map((req) => (
            <TableRow key={req.requisition_number}>
              <TableCell>{req.requisition_number}</TableCell>
              <TableCell>{req.ward_number}</TableCell>
              <TableCell>{req.requisitioned_name}</TableCell>
              <TableCell>{req.ward_name}</TableCell>
              <TableCell>{req.drug_name}</TableCell>
              <TableCell>{req.drug_number}</TableCell>
              <TableCell>{req.description}</TableCell>
              <TableCell>{req.method_of_admin}</TableCell>
              <TableCell>{req.cost_per_unit}</TableCell>
              <TableCell>{req.quantity_required}</TableCell>
              <TableCell>{req.dosage}</TableCell>
              <TableCell>{req.required_date}</TableCell>
              <TableCell>{req.received_name}</TableCell>
              <TableCell>{req.date_received}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(req)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(req)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedRequisition ? 'Edit Requisition' : 'Add Requisition'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Ward Number"
            name="ward_number"
            type="number"
            value={formValues.ward_number}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Requisitioned Name"
            name="requisitioned_name"
            value={formValues.requisitioned_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Ward Name"
            name="ward_name"
            value={formValues.ward_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Drug Name"
            name="drug_name"
            value={formValues.drug_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Drug Number"
            name="drug_number"
            type="number"
            value={formValues.drug_number}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Method of Administration"
            name="method_of_admin"
            value={formValues.method_of_admin}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Cost per Unit"
            name="cost_per_unit"
            type="number"
            value={formValues.cost_per_unit}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Quantity Required"
            name="quantity_required"
            type="number"
            value={formValues.quantity_required}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Dosage"
            name="dosage"
            value={formValues.dosage}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Required Date"
            name="required_date"
            type="date"
            value={formValues.required_date}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Received Name"
            name="received_name"
            value={formValues.received_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Date Received"
            name="date_received"
            type="date"
            value={formValues.date_received}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Only admin can perform this action."
      />
    </Container>
  );
};

export default WardRequisitions;
