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

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formValues, setFormValues] = useState({
    full_name: '',
    full_address: '',
    telephone_number: '',
    date_of_birth: '',
    sex: '',
    national_insurance_number: '',
    position_held: '',
    current_salary: '',
    salary_scale: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*');
      if (error) {
        throw error;
      }
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error.message);
    }
  };

  const handleDialogOpen = (staff) => {
    setSelectedStaff(staff);
    setOpenDialog(true);
    if (staff) {
      setFormValues({
        full_name: staff.full_name,
        full_address: staff.full_address,
        telephone_number: staff.telephone_number,
        date_of_birth: staff.date_of_birth,
        sex: staff.sex,
        national_insurance_number: staff.national_insurance_number,
        position_held: staff.position_held,
        current_salary: staff.current_salary,
        salary_scale: staff.salary_scale
      });
    } else {
      setFormValues({
        full_name: '',
        full_address: '',
        telephone_number: '',
        date_of_birth: '',
        sex: '',
        national_insurance_number: '',
        position_held: '',
        current_salary: '',
        salary_scale: ''
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
      if (!selectedStaff) {
        // Create new staff
        const { data, error } = await supabase
          .from('staff')
          .insert([formValues]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing staff
        const { data, error } = await supabase
          .from('staff')
          .update(formValues)
          .eq('staff_number', selectedStaff.staff_number); // Assuming staff_number is the identifier
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      fetchStaff();
      clearForm();
    } catch (error) {
      console.error('Error saving staff:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      full_name: '',
      full_address: '',
      telephone_number: '',
      date_of_birth: '',
      sex: '',
      national_insurance_number: '',
      position_held: '',
      current_salary: '',
      salary_scale: ''
    });
  };

  const handleDelete = async (staff) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .delete()
        .eq('staff_number', staff.staff_number); // Assuming staff_number is the identifier
      if (error) {
        throw error;
      }
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Staff Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Staff
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Full Address</TableCell>
            <TableCell>Telephone Number</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Sex</TableCell>
            <TableCell>National Insurance Number</TableCell>
            <TableCell>Position Held</TableCell>
            <TableCell>Current Salary</TableCell>
            <TableCell>Salary Scale</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((staffMember) => (
            <TableRow key={staffMember.staff_number}>
              <TableCell>{staffMember.full_name}</TableCell>
              <TableCell>{staffMember.full_address}</TableCell>
              <TableCell>{staffMember.telephone_number}</TableCell>
              <TableCell>{staffMember.date_of_birth}</TableCell>
              <TableCell>{staffMember.sex}</TableCell>
              <TableCell>{staffMember.national_insurance_number}</TableCell>
              <TableCell>{staffMember.position_held}</TableCell>
              <TableCell>{staffMember.current_salary}</TableCell>
              <TableCell>{staffMember.salary_scale}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(staffMember)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(staffMember)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent>
          <TextField 
            label="Full Name" 
            name="full_name" 
            value={formValues.full_name} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="Full Address" 
            name="full_address" 
            value={formValues.full_address} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="Telephone Number" 
            name="telephone_number" 
            value={formValues.telephone_number} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="Date of Birth" 
            name="date_of_birth" 
            type="date"
            value={formValues.date_of_birth} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField 
            label="Sex" 
            name="sex" 
            value={formValues.sex} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="National Insurance Number" 
            name="national_insurance_number" 
            value={formValues.national_insurance_number} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="Position Held" 
            name="position_held" 
            value={formValues.position_held} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="Current Salary" 
            name="current_salary" 
            value={formValues.current_salary} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
          />
          <TextField 
            label="Salary Scale" 
            name="salary_scale" 
            value={formValues.salary_scale} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
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

export default Staff;
