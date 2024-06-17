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

const Qualification = () => {
  const [qualifications, setQualifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [formValues, setFormValues] = useState({
    staff_number: '',
    date_of_quali: '',
    type: '',
    name_of_institution: '',
  });

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    try {
      const { data, error } = await supabase
        .from('qualifications')
        .select('*');
      if (error) {
        throw error;
      }
      setQualifications(data);
    } catch (error) {
      console.error('Error fetching qualifications:', error.message);
    }
  };

  const handleDialogOpen = (qualification) => {
    setSelectedQualification(qualification);
    setOpenDialog(true);
    if (qualification) {
      setFormValues({
        staff_number: qualification.staff_number,
        date_of_quali: qualification.date_of_quali,
        type: qualification.type,
        name_of_institution: qualification.name_of_institution,
      });
    } else {
      setFormValues({
        staff_number: '',
        date_of_quali: '',
        type: '',
        name_of_institution: '',
      });
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedQualification(null); // Reset selected qualification
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      if (!selectedQualification) {
        // Create new qualification
        const { data, error } = await supabase
          .from('qualifications')
          .insert([formValues]);
        if (error) {
          console.error('Error creating qualification:', error.message);
          alert(`Error creating qualification: ${error.message}`);
          return;
        }
        console.log('New qualification created:', data);
      } else {
        // Update existing qualification
        const { data, error } = await supabase
          .from('qualifications')
          .update(formValues)
          .eq('staff_number', selectedQualification.staff_number)
          .eq('date_of_quali', selectedQualification.date_of_quali);
        if (error) {
          console.error('Error updating qualification:', error.message);
          alert(`Error updating qualification: ${error.message}`);
          return;
        }
        console.log('Qualification updated:', data);
      }
      setOpenDialog(false);
      fetchQualifications();
      clearForm();
    } catch (error) {
      console.error('Error saving qualification:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      staff_number: '',
      date_of_quali: '',
      type: '',
      name_of_institution: '',
    });
  };

  const handleDelete = async (qualification) => {
    try {
      const { data, error } = await supabase
        .from('qualifications')
        .delete()
        .eq('staff_number', qualification.staff_number)
        .eq('date_of_quali', qualification.date_of_quali);
      if (error) {
        console.error('Error deleting qualification:', error.message);
        alert(`Error deleting qualification: ${error.message}`);
        return;
      }
      console.log('Qualification deleted:', data);
      fetchQualifications();
    } catch (error) {
      console.error('Error deleting qualification:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Qualifications Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Qualification
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Staff Number</TableCell>
            <TableCell>Date of Qualification</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Name of Institution</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qualifications.map((qualification) => (
            <TableRow key={`${qualification.staff_number}-${qualification.date_of_quali}`}>
              <TableCell>{qualification.staff_number}</TableCell>
              <TableCell>{qualification.date_of_quali}</TableCell>
              <TableCell>{qualification.type}</TableCell>
              <TableCell>{qualification.name_of_institution}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(qualification)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(qualification)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedQualification ? 'Edit Qualification' : 'Add Qualification'}</DialogTitle>
        <DialogContent>
          <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth />
          <TextField label="Date of Qualification" name="date_of_quali" value={formValues.date_of_quali} onChange={handleChange} fullWidth />
          <TextField label="Type" name="type" value={formValues.type} onChange={handleChange} fullWidth />
          <TextField label="Name of Institution" name="name_of_institution" value={formValues.name_of_institution} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Qualification;
