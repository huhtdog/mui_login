import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';

export default function Patients() {
  // Initialize Supabase client
  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*');
      
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setPatients(data);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
    setIsEdit(false);
    setSelectedId(null);
  };

  const onSubmit = async (data) => {
    if (isEdit) {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('patient_number', selectedId);
      
      if (error) {
        console.error('Error updating data:', error);
      } else {
        setPatients(patients.map(patient => patient.patient_number === selectedId ? { ...patient, ...data } : patient));
      }
    } else {
      const { error } = await supabase
        .from('patients')
        .insert([data]);

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        setPatients([...patients, data]);
      }
    }
    handleClose();
  };

  const handleEdit = (patient) => {
    setSelectedId(patient.patient_number);
    setIsEdit(true);
    setValue('first_name', patient.first_name);
    setValue('last_name', patient.last_name);
    setValue('address', patient.address);
    setValue('telephone_number', patient.telephone_number);
    setValue('date_of_birth', patient.date_of_birth);
    setValue('sex', patient.sex);
    setValue('marital_status', patient.marital_status);
    setValue('date_registered', patient.date_registered);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('patient_number', id);

    if (error) {
      console.error('Error deleting data:', error);
    } else {
      setPatients(patients.filter(patient => patient.patient_number !== id));
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Patient
      </Button>
      <TableContainer component={Paper}>
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
            {patients.map((row) => (
              <TableRow key={row.patient_number}>
                <TableCell>{row.patient_number}</TableCell>
                <TableCell>{row.first_name}</TableCell>
                <TableCell>{row.last_name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.telephone_number}</TableCell>
                <TableCell>{row.date_of_birth}</TableCell>
                <TableCell>{row.sex}</TableCell>
                <TableCell>{row.marital_status}</TableCell>
                <TableCell>{row.date_registered}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(row)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(row.patient_number)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('first_name')} label="First Name" fullWidth margin="normal" />
            <TextField {...register('last_name')} label="Last Name" fullWidth margin="normal" />
            <TextField {...register('address')} label="Address" fullWidth margin="normal" />
            <TextField {...register('telephone_number')} label="Telephone Number" fullWidth margin="normal" />
            <TextField {...register('date_of_birth')} label="Date of Birth" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField {...register('sex')} label="Sex" fullWidth margin="normal" />
            <TextField {...register('marital_status')} label="Marital Status" fullWidth margin="normal" />
            <TextField {...register('date_registered')} label="Date Registered" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isEdit ? 'Save' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
