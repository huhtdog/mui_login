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

const WardManagement = () => {
  const [wards, setWards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [formValues, setFormValues] = useState({
    ward_number: '',
    ward_name: '',
    location: '',
    total_num_of_beds: '',
    telephone_extension_num: '',
  });
  const [error, setError] = useState('');

  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const { data, error } = await supabase.from('ward').select('*');
      if (error) throw error;
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error.message);
    }
  };

  const handleDialogOpen = (ward) => {
    setSelectedWard(ward);
    setOpenDialog(true);
    if (ward) {
      setFormValues({
        ward_number: ward.ward_number,
        ward_name: ward.ward_name,
        location: ward.location,
        total_num_of_beds: ward.total_num_of_beds,
        telephone_extension_num: ward.telephone_extension_num,
      });
    } else {
      setFormValues({
        ward_number: '',
        ward_name: '',
        location: '',
        total_num_of_beds: '',
        telephone_extension_num: '',
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
      const { data: existingData, error: fetchError } = await supabase
        .from('ward')
        .select('*')
        .eq('ward_number', formValues.ward_number);
        
      if (fetchError) throw fetchError;
      if (existingData.length > 0 && !selectedWard) {
        setError('Ward number already exists. Please use a different ward number.');
        return;
      }

      if (!selectedWard) {
        // Create new ward
        const { data, error } = await supabase.from('ward').insert([formValues]);
        if (error) throw error;
        console.log('Inserted:', data);
      } else {
        // Update existing ward
        const { data, error } = await supabase.from('ward').update(formValues).eq('ward_number', selectedWard.ward_number);
        if (error) throw error;
        console.log('Updated:', data);
      }
      setOpenDialog(false);
      fetchWards();
      clearForm();
    } catch (error) {
      console.error('Error saving ward:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      ward_number: '',
      ward_name: '',
      location: '',
      total_num_of_beds: '',
      telephone_extension_num: '',
    });
  };

  const handleDelete = async (ward) => {
    try {
      const { data, error } = await supabase.from('ward').delete().eq('ward_number', ward.ward_number);
      if (error) throw error;
      console.log('Deleted:', data);
      fetchWards();
    } catch (error) {
      console.error('Error deleting ward:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Ward Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Ward
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ward Number</TableCell>
            <TableCell>Ward Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Total Number of Beds</TableCell>
            <TableCell>Telephone Extension Number</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wards.map((ward) => (
            <TableRow key={ward.ward_number}>
              <TableCell>{ward.ward_number}</TableCell>
              <TableCell>{ward.ward_name}</TableCell>
              <TableCell>{ward.location}</TableCell>
              <TableCell>{ward.total_num_of_beds}</TableCell>
              <TableCell>{ward.telephone_extension_num}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(ward)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(ward)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedWard ? 'Edit Ward' : 'Add Ward'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Ward Number" name="ward_number" value={formValues.ward_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Ward Name" name="ward_name" value={formValues.ward_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Location" name="location" value={formValues.location} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Total Number of Beds" name="total_num_of_beds" value={formValues.total_num_of_beds} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Telephone Extension Number" name="telephone_extension_num" value={formValues.telephone_extension_num} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WardManagement;
