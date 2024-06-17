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

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formValues, setFormValues] = useState({
    patient_name: '',
    staff_number: '',
    date_and_time: '',
    examination_room: '',
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
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase.from('patient_appointments').select('*');
      if (error) throw error;
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    }
  };

  const handleDialogOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
    if (appointment) {
      setFormValues({
        patient_name: appointment.patient_name,
        staff_number: appointment.staff_number,
        date_and_time: appointment.date_and_time,
        examination_room: appointment.examination_room,
      });
    } else {
      setFormValues({
        patient_name: '',
        staff_number: '',
        date_and_time: '',
        examination_room: '',
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
      if (!selectedAppointment) {
        // Create new appointment
        const { data, error } = await supabase.from('patient_appointments').insert([formValues]);
        if (error) throw error;
        console.log('Inserted:', data);
      } else {
        // Update existing appointment
        const { data, error } = await supabase.from('patient_appointments').update(formValues).eq('appointment_number', selectedAppointment.appointment_number);
        if (error) throw error;
        console.log('Updated:', data);
      }
      setOpenDialog(false);
      fetchAppointments();
      clearForm();
    } catch (error) {
      console.error('Error saving appointment:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      patient_name: '',
      staff_number: '',
      date_and_time: '',
      examination_room: '',
    });
  };

  const handleDelete = async (appointment) => {
    try {
      const { data, error } = await supabase.from('patient_appointments').delete().eq('appointment_number', appointment.appointment_number);
      if (error) throw error;
      console.log('Deleted:', data);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patient Appointments
      </Typography>
      {userEmail === 'admin@user.com' && (
        <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
          Add Appointment
        </Button>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Appointment Number</TableCell>
            <TableCell>Patient Name</TableCell>
            <TableCell>Staff Number</TableCell>
            <TableCell>Date and Time</TableCell>
            <TableCell>Examination Room</TableCell>
            {userEmail === 'admin@user.com' && (
              <TableCell>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.appointment_number}>
              <TableCell>{appointment.appointment_number}</TableCell>
              <TableCell>{appointment.patient_name}</TableCell>
              <TableCell>{appointment.staff_number}</TableCell>
              <TableCell>{appointment.date_and_time}</TableCell>
              <TableCell>{appointment.examination_room}</TableCell>
              {userEmail === 'admin@user.com' && (
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(appointment)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(appointment)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedAppointment ? 'Edit Appointment' : 'Add Appointment'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Patient Name" name="patient_name" value={formValues.patient_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Date and Time" name="date_and_time" type="datetime-local" value={formValues.date_and_time} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Examination Room" name="examination_room" value={formValues.examination_room} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientAppointments;
