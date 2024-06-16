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

const Patients = () => {
  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formValues, setFormValues] = useState({
    patient_number: '',
    first_name: '',
    last_name: '',
    address: '',
    telephone_number: '',
    date_of_birth: '',
    sex: '',
    marital_status: '',
    date_registered: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*');
      if (error) {
        throw error;
      }
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  };

  const handleDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
    if (patient) {
      setFormValues({ ...patient });
    } else {
      setFormValues({
        patient_number: '',
        first_name: '',
        last_name: '',
        address: '',
        telephone_number: '',
        date_of_birth: '',
        sex: '',
        marital_status: '',
        date_registered: '',
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
      if (!selectedPatient) {
        // Create new patient
        const { data, error } = await supabase
          .from('patients')
          .insert([formValues]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing patient
        const { data, error } = await supabase
          .from('patients')
          .update(formValues)
          .eq('patient_number', selectedPatient.patient_number);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      await fetchPatients();
      clearForm();
    } catch (error) {
      console.error('Error saving patient:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      patient_number: '',
      first_name: '',
      last_name: '',
      address: '',
      telephone_number: '',
      date_of_birth: '',
      sex: '',
      marital_status: '',
      date_registered: '',
    });
  };

  const handleDelete = async (patient) => {
    try {
      const { data, error } = await supabase.from('patients').delete().eq('patient_number', patient.patient_number);
      if (error) {
        throw error;
      }
      await fetchPatients(); // Ensure to await the fetchPatients() function call
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Patient
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Number</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Telephone Number</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Sex</TableCell>
            <TableCell>Marital Status</TableCell>
            <TableCell>Date Registered</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.patient_number}>
              <TableCell>{patient.patient_number}</TableCell>
              <TableCell>{patient.first_name}</TableCell>
              <TableCell>{patient.last_name}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.telephone_number}</TableCell>
              <TableCell>{patient.date_of_birth}</TableCell>
              <TableCell>{patient.sex}</TableCell>
              <TableCell>{patient.marital_status}</TableCell>
              <TableCell>{patient.date_registered}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(patient)} aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(patient)} aria-label="delete">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          {/* Do not display or edit patient_number field */}
          {!selectedPatient && (
            <TextField
              label="Patient Number"
              name="patient_number"
              value={formValues.patient_number}
              onChange={handleChange}
              fullWidth
              disabled
            />
          )}
          <TextField label="First Name" name="first_name" value={formValues.first_name} onChange={handleChange} fullWidth />
          <TextField label="Last Name" name="last_name" value={formValues.last_name} onChange={handleChange} fullWidth />
          <TextField label="Address" name="address" value={formValues.address} onChange={handleChange} fullWidth />
          <TextField label="Telephone Number" name="telephone_number" value={formValues.telephone_number} onChange={handleChange} fullWidth />
          <TextField label="Date of Birth" type="date" name="date_of_birth" value={formValues.date_of_birth} onChange={handleChange} fullWidth />
          <TextField label="Sex" name="sex" value={formValues.sex} onChange={handleChange} fullWidth />
          <TextField label="Marital Status" name="marital_status" value={formValues.marital_status} onChange={handleChange} fullWidth />
          <TextField label="Date Registered" type="date" name="date_registered" value={formValues.date_registered} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Patients;
