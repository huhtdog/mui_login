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
  const [staffs, setStaffs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formValues, setFormValues] = useState({
    staff_number: '',
    full_name: '',
    full_address: '',
    telephone_number: '',
    date_of_birth: '',
    sex: '',
    national_insurance_number: '',
    position_held: '',
    current_salary: '',
    salary_scale: '',
  });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*');
      if (error) {
        throw error;
      }
      setStaffs(data);
    } catch (error) {
      console.error('Error fetching staff:', error.message);
    }
  };

  const handleDialogOpen = (staff) => {
    setSelectedStaff(staff);
    setOpenDialog(true);
    if (staff) {
      setFormValues({
        staff_number: staff.staff_number,
        full_name: staff.full_name,
        full_address: staff.full_address,
        telephone_number: staff.telephone_number,
        date_of_birth: staff.date_of_birth,
        sex: staff.sex,
        national_insurance_number: staff.national_insurance_number,
        position_held: staff.position_held,
        current_salary: staff.current_salary.toString(),
        salary_scale: staff.salary_scale.toString(),
      });
    } else {
      setFormValues({
        staff_number: '',
        full_name: '',
        full_address: '',
        telephone_number: '',
        date_of_birth: '',
        sex: '',
        national_insurance_number: '',
        position_held: '',
        current_salary: '',
        salary_scale: '',
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
          .eq('staff_number', selectedStaff.staff_number);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      fetchStaffs();
      clearForm();
    } catch (error) {
      console.error('Error saving staff:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      staff_number: '',
      full_name: '',
      full_address: '',
      telephone_number: '',
      date_of_birth: '',
      sex: '',
      national_insurance_number: '',
      position_held: '',
      current_salary: '',
      salary_scale: '',
    });
  };

  const handleDelete = async (staff) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .delete()
        .eq('staff_number', staff.staff_number);
      if (error) {
        throw error;
      }
      fetchStaffs();
    } catch (error) {
      console.error('Error deleting staff:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Staff
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Staff
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Staff Number</TableCell>
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
          {staffs.map((staff) => (
            <TableRow key={staff.staff_number}>
              <TableCell>{staff.staff_number}</TableCell>
              <TableCell>{staff.full_name}</TableCell>
              <TableCell>{staff.full_address}</TableCell>
              <TableCell>{staff.telephone_number}</TableCell>
              <TableCell>{staff.date_of_birth}</TableCell>
              <TableCell>{staff.sex}</TableCell>
              <TableCell>{staff.national_insurance_number}</TableCell>
              <TableCell>{staff.position_held}</TableCell>
              <TableCell>{staff.current_salary}</TableCell>
              <TableCell>{staff.salary_scale}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(staff)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(staff)}>
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
          {selectedStaff && (
            <TextField
              label="Staff Number"
              value={formValues.staff_number}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          <TextField label="Full Name" name="full_name" value={formValues.full_name} onChange={handleChange} fullWidth />
          <TextField label="Full Address" name="full_address" value={formValues.full_address} onChange={handleChange} fullWidth />
          <TextField label="Telephone Number" name="telephone_number" value={formValues.telephone_number} onChange={handleChange} fullWidth />
          <TextField label="Date of Birth" name="date_of_birth" value={formValues.date_of_birth} onChange={handleChange} fullWidth />
          <TextField label="Sex" name="sex" value={formValues.sex} onChange={handleChange} fullWidth />
          <TextField label="National Insurance Number" name="national_insurance_number" value={formValues.national_insurance_number} onChange={handleChange} fullWidth />
          <TextField label="Position Held" name="position_held" value={formValues.position_held} onChange={handleChange} fullWidth />
          <TextField label="Current Salary" name="current_salary" value={formValues.current_salary} onChange={handleChange} fullWidth />
          <TextField label="Salary Scale" name="salary_scale" value={formValues.salary_scale} onChange={handleChange} fullWidth />
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
