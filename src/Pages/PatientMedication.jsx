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
  Snackbar,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function PatientMedication() {
  const [medications, setMedications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    patient_number: '',
    bed_number: '',
    ward_number: '',
    drug_number: '',
    drug_name: '',
    method_of_admin: '',
    units_per_day: '',
    start_date: '',
    finish_date: '',
    patient_name: '',
  });

  // Initialize Supabase client
  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Retrieve the authentication token from localStorage
  const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');
  const authToken = JSON.parse(authTokenString);
  const userEmail = authToken.user.email;

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase.from('patientmedication').select('*');
      if (error) {
        throw error;
      }
      setMedications(data);
    } catch (error) {
      console.error('Error fetching medications:', error.message);
    }
  };

  const handleDialogOpen = (medication) => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }
    setSelectedMedication(medication);
    setOpenDialog(true);
    if (medication) {
      setFormValues({
        patient_number: medication.patient_number,
        bed_number: medication.bed_number,
        ward_number: medication.ward_number,
        drug_number: medication.drug_number,
        drug_name: medication.drug_name,
        method_of_admin: medication.method_of_admin,
        units_per_day: medication.units_per_day,
        start_date: medication.start_date,
        finish_date: medication.finish_date,
        patient_name: medication.patient_name,
      });
    } else {
      setFormValues({
        patient_number: '',
        bed_number: '',
        ward_number: '',
        drug_number: '',
        drug_name: '',
        method_of_admin: '',
        units_per_day: '',
        start_date: '',
        finish_date: '',
        patient_name: '',
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
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }
    try {
      if (!selectedMedication) {
        // Create new medication
        const { data, error } = await supabase.from('patientmedication').insert([formValues]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing medication
        const { data, error } = await supabase.from('patientmedication').update(formValues).eq('patient_number', selectedMedication.patient_number);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      fetchMedications();
      clearForm();
    } catch (error) {
      console.error('Error saving medication:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      patient_number: '',
      bed_number: '',
      ward_number: '',
      drug_number: '',
      drug_name: '',
      method_of_admin: '',
      units_per_day: '',
      start_date: '',
      finish_date: '',
      patient_name: '',
    });
  };

  const handleDelete = async (medication) => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }
    try {
      const { data, error } = await supabase.from('patientmedication').delete().eq('patient_number', medication.patient_number);
      if (error) {
        throw error;
      }
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patient Medication
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>Add Medication</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Number</TableCell>
            <TableCell>Bed Number</TableCell>
            <TableCell>Ward Number</TableCell>
            <TableCell>Drug Number</TableCell>
            <TableCell>Drug Name</TableCell>
            <TableCell>Method of Administration</TableCell>
            <TableCell>Units per Day</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Finish Date</TableCell>
            <TableCell>Patient Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.patient_number}>
              <TableCell>{medication.patient_number}</TableCell>
              <TableCell>{medication.bed_number}</TableCell>
              <TableCell>{medication.ward_number}</TableCell>
              <TableCell>{medication.drug_number}</TableCell>
              <TableCell>{medication.drug_name}</TableCell>
              <TableCell>{medication.method_of_admin}</TableCell>
              <TableCell>{medication.units_per_day}</TableCell>
              <TableCell>{medication.start_date}</TableCell>
              <TableCell>{medication.finish_date}</TableCell>
              <TableCell>{medication.patient_name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(medication)} aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(medication)} aria-label="delete">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedMedication ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
        <DialogContent>
          <TextField label="Patient Number" name="patient_number" value={formValues.patient_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Bed Number" name="bed_number" value={formValues.bed_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Ward Number" name="ward_number" value={formValues.ward_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Drug Number" name="drug_number" value={formValues.drug_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Drug Name" name="drug_name" value={formValues.drug_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Method of Administration" name="method_of_admin" value={formValues.method_of_admin} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Units per Day" name="units_per_day" value={formValues.units_per_day} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Start Date (YYYY-MM-DD)" name="start_date" value={formValues.start_date} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Finish Date (YYYY-MM-DD)" name="finish_date" value={formValues.finish_date} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Patient Name" name="patient_name" value={formValues.patient_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
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
        message="Only admin users can perform this action."
      />
    </Container>
  );
}

export default PatientMedication;
