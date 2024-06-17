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
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const StaffAllocation = () => {
  const [allocations, setAllocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [formValues, setFormValues] = useState({
    staff_number: '',
    position: '',
    shift: '',
    ward_number: '',
  });
  const [error, setError] = useState('');

  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Retrieve the authentication token from localStorage
  const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');
  const authToken = JSON.parse(authTokenString);
  const userEmail = authToken.user.email;

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const { data, error } = await supabase.from('staffallocation').select('*');
      if (error) throw error;
      setAllocations(data);
    } catch (error) {
      console.error('Error fetching allocations:', error.message);
    }
  };

  const handleDialogOpen = (allocation) => {
    setSelectedAllocation(allocation);
    setOpenDialog(true);
    if (allocation) {
      setFormValues({
        staff_number: allocation.staff_number,
        position: allocation.position,
        shift: allocation.shift,
        ward_number: allocation.ward_number,
      });
    } else {
      setFormValues({
        staff_number: '',
        position: '',
        shift: '',
        ward_number: '',
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

  const handleFormSubmit = async () => {
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('staffallocation')
        .select('*')
        .eq('staff_number', formValues.staff_number);

      if (fetchError) throw fetchError;
      if (existingData.length > 0 && !selectedAllocation) {
        setError('Staff number already exists. Please use a different staff number.');
        return;
      }

      if (!selectedAllocation) {
        // Create new allocation
        const { data, error } = await supabase.from('staffallocation').insert([formValues]);
        if (error) throw error;
        console.log('Inserted:', data);
      } else {
        // Update existing allocation
        const { data, error } = await supabase.from('staffallocation').update(formValues).eq('staff_number', selectedAllocation.staff_number);
        if (error) throw error;
        console.log('Updated:', data);
      }
      setOpenDialog(false);
      fetchAllocations();
      clearForm();
    } catch (error) {
      console.error('Error saving allocation:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      staff_number: '',
      position: '',
      shift: '',
      ward_number: '',
    });
  };

  const handleDelete = async (allocation) => {
    try {
      const { data, error } = await supabase.from('staffallocation').delete().eq('staff_number', allocation.staff_number);
      if (error) throw error;
      console.log('Deleted:', data);
      fetchAllocations();
    } catch (error) {
      console.error('Error deleting allocation:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Staff Allocations
      </Typography>
      {userEmail === 'admin@user.com' && (
        <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
          Add Allocation
        </Button>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Staff Number</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Shift</TableCell>
            <TableCell>Ward Number</TableCell>
            {userEmail === 'admin@user.com' && (
              <TableCell>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {allocations.map((allocation) => (
            <TableRow key={allocation.staff_number}>
              <TableCell>{allocation.staff_number}</TableCell>
              <TableCell>{allocation.position}</TableCell>
              <TableCell>{allocation.shift}</TableCell>
              <TableCell>{allocation.ward_number}</TableCell>
              {userEmail === 'admin@user.com' && (
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(allocation)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(allocation)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedAllocation ? 'Edit Allocation' : 'Add Allocation'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Position" name="position" value={formValues.position} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Shift" name="shift" value={formValues.shift} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Ward Number" name="ward_number" value={formValues.ward_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffAllocation;
