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

const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
const supabase = createClient(supabaseUrl, supabaseKey);

const StaffAllocation = () => {
  const [staffAllocations, setStaffAllocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [formValues, setFormValues] = useState({
    staff_number: '',
    position: '',
    shift: '',
    ward_number: '',
  });

  useEffect(() => {
    fetchStaffAllocations();
  }, []);

  const fetchStaffAllocations = async () => {
    try {
      const { data, error } = await supabase
        .from('staffallocation')
        .select('*');
      if (error) {
        throw error;
      }
      setStaffAllocations(data);
    } catch (error) {
      console.error('Error fetching staff allocations:', error.message);
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
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      if (!selectedAllocation) {
        // Create new staff allocation
        const { data, error } = await supabase
          .from('staffallocation')
          .insert([formValues]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing staff allocation
        const { data, error } = await supabase
          .from('staffallocation')
          .update(formValues)
          .eq('staff_number', selectedAllocation.staff_number)
          .eq('ward_number', selectedAllocation.ward_number);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      fetchStaffAllocations();
      clearForm();
    } catch (error) {
      console.error('Error saving staff allocation:', error.message);
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
      const { data, error } = await supabase
        .from('staffallocation')
        .delete()
        .eq('staff_number', allocation.staff_number)
        .eq('ward_number', allocation.ward_number);
      if (error) {
        throw error;
      }
      fetchStaffAllocations();
    } catch (error) {
      console.error('Error deleting staff allocation:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Staff Allocation
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Staff Allocation
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Staff Number</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Shift</TableCell>
            <TableCell>Ward Number</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staffAllocations.map((allocation) => (
            <TableRow key={`${allocation.staff_number}-${allocation.ward_number}`}>
              <TableCell>{allocation.staff_number}</TableCell>
              <TableCell>{allocation.position}</TableCell>
              <TableCell>{allocation.shift}</TableCell>
              <TableCell>{allocation.ward_number}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(allocation)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(allocation)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedAllocation ? 'Edit Staff Allocation' : 'Add Staff Allocation'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Staff Number"
            name="staff_number"
            value={formValues.staff_number}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Position"
            name="position"
            value={formValues.position}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Shift"
            name="shift"
            value={formValues.shift}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Ward Number"
            name="ward_number"
            value={formValues.ward_number}
            onChange={handleChange}
            fullWidth
          />
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
