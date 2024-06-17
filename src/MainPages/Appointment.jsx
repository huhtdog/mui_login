import React, { useState } from 'react';
import { Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

export default function BookAppointments() {
  const [formData, setFormData] = useState({
    name: '',
    clinicNumber: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add form submission logic here

    // Redirect to another page, e.g., confirmation page
    navigate('/confirmation');
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Book an Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name of the Patient"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinic Number"
              name="clinicNumber"
              value={formData.clinicNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Preferred Appointment Date"
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Preferred Appointment Time"
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
