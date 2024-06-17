import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function BookAppointments() {
  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
  const supabase = createClient(supabaseUrl, supabaseKey);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const [formData, setFormData] = useState({
    name: '',
    clinicNumber: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [patientNames, setPatientNames] = useState([]);

  useEffect(() => {
    async function fetchPatientNames() {
      try {
        const { data, error } = await supabase.from('patient_appointments').select('patient_name');
        if (error) {
          throw error;
        }
        setPatientNames(data.map((patient) => patient.patient_name));
      } catch (error) {
        console.error('Error fetching patient names:', error.message);
      }
    }
    fetchPatientNames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);

    const { data, error } = await supabase
      .from('waiting_list')
      .insert([
        {
          name: formData.name,
          clinic_number: parseInt(formData.clinicNumber),
          date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
        },
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
      // Optionally, you can reset the form or show a success message here
      setFormData({
        name: '',
        clinicNumber: '',
        appointmentDate: '',
        appointmentTime: '',
      });
      // Navigate to the waiting list component
      navigate('/waitinglist');
    }
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
              select
              fullWidth
              label="Name of the Patient"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              {patientNames.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
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
