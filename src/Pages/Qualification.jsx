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

function Qualification() {
  const [qualifications, setQualifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [formValues, setFormValues] = useState({
    staff_number: '',
    date_of_qualification: '',
    type: '',
    institution_name: '',
  });

  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    try {
      const { data, error } = await supabase.from('qualifications').select('*');
      if (error) throw error;
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
        date_of_qualification: qualification.date_of_qualification,
        type: qualification.type,
        institution_name: qualification.institution_name,
      });
    } else {
      setFormValues({
        staff_number: '',
        date_of_qualification: '',
        type: '',
        institution_name: '',
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
      if (!selectedQualification) {
        const { data, error } = await supabase.from('qualifications').insert([formValues]);
        if (error) throw error;
        console.log('Inserted:', data);
      } else {
        const { data, error } = await supabase.from('qualifications').update(formValues).eq('id', selectedQualification.id);
        if (error) throw error;
        console.log('Updated:', data);
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
      date_of_qualification: '',
      type: '',
      institution_name: '',
    });
  };

  const handleDelete = async (qualification) => {
    try {
      const { data, error } = await supabase.from('qualifications').delete().eq('id', qualification.id);
      if (error) throw error;
      console.log('Deleted:', data);
      fetchQualifications();
    } catch (error) {
      console.error('Error deleting qualification:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Qualifications
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
            <TableCell>Institution Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qualifications.map((qualification) => (
            <TableRow key={qualification.id}>
              <TableCell>{qualification.staff_number}</TableCell>
              <TableCell>{qualification.date_of_qualification}</TableCell>
              <TableCell>{qualification.type}</TableCell>
              <TableCell>{qualification.institution_name}</TableCell>
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
          <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Date of Qualification (YYYY-MM-DD)" name="date_of_qualification" value={formValues.date_of_qualification} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Type" name="type" value={formValues.type} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Institution Name" name="institution_name" value={formValues.institution_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Qualification;
