import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function OutPatient() {
  const [outPatients, setOutPatients] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('out_patient')
        .select('*');
      
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setOutPatients(data);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    const { error } = await supabase
      .from('out_patient')
      .insert([data]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      setOutPatients([...outPatients, data]);
      reset();
      handleClose();
    }
  };

  const handleBackToPatient = () => {
    navigate('/dashboard/main/patient'); // Navigate to the specified route
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToPatient} // Use the new function
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Number</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Appointment Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outPatients.map((row) => (
              <TableRow key={`${row.patient_number}-${row.appointment_date}`}>
                <TableCell>{row.patient_number}</TableCell>
                <TableCell>{row.appointment_date}</TableCell>
                <TableCell>{row.appointment_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Outpatient Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Outpatient</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('patient_number')} label="Patient Number" fullWidth margin="normal" required />
            <TextField {...register('appointment_date')} label="Appointment Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            <TextField {...register('appointment_time')} label="Appointment Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Paper>
  )
}
