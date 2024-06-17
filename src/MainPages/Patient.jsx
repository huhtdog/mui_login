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

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formValues, setFormValues] = useState({
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
      setFormValues({
        first_name: patient.first_name,
        last_name: patient.last_name,
        address: patient.address,
        telephone_number: patient.telephone_number,
        date_of_birth: patient.date_of_birth,
        sex: patient.sex,
        marital_status: patient.marital_status,
        date_registered: patient.date_registered,
      });
    } else {
      setFormValues({
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
      const valuesToSubmit = { ...formValues };
      if (!selectedPatient) {
        // Remove patient_number from valuesToSubmit if it's a new patient
        delete valuesToSubmit.patient_number;

        // Create new patient
        const { data, error } = await supabase
          .from('patients')
          .insert([valuesToSubmit]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing patient
        const { data, error } = await supabase
          .from('patients')
          .update(valuesToSubmit)
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
      const { data, error } = await supabase
        .from('patients')
        .delete()
        .eq('patient_number', patient.patient_number);
      if (error) {
        throw error;
      }
      await fetchPatients();
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
          <TextField label="First Name" name="first_name" value={formValues.first_name} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Last Name" name="last_name" value={formValues.last_name} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Address" name="address" value={formValues.address} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Telephone Number" name="telephone_number" value={formValues.telephone_number} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Date of Birth" name="date_of_birth" type="date" value={formValues.date_of_birth} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="Sex" name="sex" value={formValues.sex} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Marital Status" name="marital_status" value={formValues.marital_status} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Date Registered" name="date_registered" type="date" value={formValues.date_registered} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
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
