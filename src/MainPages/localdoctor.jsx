import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, IconButton } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material'; // Import the Delete icon

const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LocalDoctors() {
  const [localDoctors, setLocalDoctors] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');
  const authToken = JSON.parse(authTokenString);
  const userEmail = authToken?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('localdoctors')
        .select('*');
      
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setLocalDoctors(data);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }
    const { error } = await supabase
      .from('localdoctors')
      .insert([data]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      setLocalDoctors([...localDoctors, data]);
      reset();
      handleClose();
    }
  };

  const handleDelete = async (clinicNumber) => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }
    const { error } = await supabase
      .from('localdoctors')
      .delete()
      .eq('clinic_number', clinicNumber);

    if (error) {
      console.error('Error deleting data:', error);
    } else {
      setLocalDoctors(localDoctors.filter(doctor => doctor.clinic_number !== clinicNumber));
    }
  };

  const handleBackToPatient = () => {
    navigate('/dashboard/main/patient');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToPatient}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2, ml: 2 }}
      >
        Create
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clinic Number</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Actions</TableCell> {/* Add Actions column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {localDoctors.map((row) => (
              <TableRow key={`${row.clinic_number}-${row.full_name}`}>
                <TableCell>{row.clinic_number}</TableCell>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.telephone_number}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(row.clinic_number)}
                    aria-label="delete"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Local Doctor</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('clinic_number')} label="Clinic Number" fullWidth margin="normal" required />
            <TextField {...register('full_name')} label="Full Name" fullWidth margin="normal" required />
            <TextField {...register('address')} label="Address" fullWidth margin="normal" required />
            <TextField {...register('telephone_number')} label="Telephone Number" fullWidth margin="normal" required />
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Only the admin can modify this"
      />
    </Paper>
  );
}
