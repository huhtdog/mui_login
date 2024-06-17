import React, { useState } from 'react';
import { Paper, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';


export default function BookAppointments() {

  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [formData, setFormData] = useState({
    appointmentNumber: '', // Serial type in PostgreSQL
    patientName: '',
    staffNumber: '',
    dateAndTime: '', // Assuming timestamp without time zone will be formatted by the user
    examinationRoom: '',
  });

  const [examinationRoomOptions, setExaminationRoomOptions] = useState([
    { value: 'Room A', label: 'Room A' },
    { value: 'Room B', label: 'Room B' },
    { value: 'Room C', label: 'Room C' },
    { value: 'Room D', label: 'Room D' },
    { value: 'Room E', label: 'Room E' },
    { value: 'Room F', label: 'Room F' },
    // Add other room options as needed
  ]);

  const navigate = useNavigate();

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
              label="Appointment Number"
              name="appointmentNumber"
              value={formData.appointmentNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Staff Number"
              name="staffNumber"
              value={formData.staffNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date and Time"
              type="datetime-local" // Assuming input is a datetime-local format
              name="dateAndTime"
              value={formData.dateAndTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Examination Room"
              name="examinationRoom"
              value={formData.examinationRoom}
              onChange={handleChange}
              required
            >
              {examinationRoomOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
