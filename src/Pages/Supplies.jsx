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
  Snackbar,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Supplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [filteredSupplies, setFilteredSupplies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [formValues, setFormValues] = useState({
    sup_name: '',
    address_num: '',
    phone_num: '',
    fax_num: '',
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Retrieve the authentication token from localStorage
  const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');
  const authToken = JSON.parse(authTokenString);
  const userEmail = authToken.user.email;

  useEffect(() => {
    fetchSupplies();
  }, []);

  useEffect(() => {
    filterSupplies();
  }, [searchQuery, supplies]);

  const fetchSupplies = async () => {
    try {
      const { data, error } = await supabase.from('supplies').select('*');
      if (error) throw error;
      setSupplies(data);
    } catch (error) {
      console.error('Error fetching supplies:', error.message);
    }
  };

  const filterSupplies = () => {
    const query = searchQuery.toLowerCase();
    const filtered = supplies.filter(
      (supply) =>
        supply.sup_name.toLowerCase().includes(query) ||
        supply.address_num.toLowerCase().includes(query) ||
        supply.phone_num.toLowerCase().includes(query) ||
        supply.fax_num.toLowerCase().includes(query)
    );
    setFilteredSupplies(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDialogOpen = (supply) => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }

    setSelectedSupply(supply);
    setOpenDialog(true);
    if (supply) {
      setFormValues({
        sup_name: supply.sup_name,
        address_num: supply.address_num,
        phone_num: supply.phone_num,
        fax_num: supply.fax_num,
      });
    } else {
      setFormValues({
        sup_name: '',
        address_num: '',
        phone_num: '',
        fax_num: '',
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
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }

    try {
      if (!selectedSupply) {
        // Create new supply
        const { data, error } = await supabase.from('supplies').insert([formValues]);
        if (error) throw error;
        console.log('Inserted:', data);
      } else {
        // Update existing supply
        const { data, error } = await supabase.from('supplies').update(formValues).eq('supplier_id', selectedSupply.supplier_id);
        if (error) throw error;
        console.log('Updated:', data);
      }
      setOpenDialog(false);
      fetchSupplies();
      clearForm();
    } catch (error) {
      console.error('Error saving supply:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      sup_name: '',
      address_num: '',
      phone_num: '',
      fax_num: '',
    });
  };

  const handleDelete = async (supply) => {
    if (userEmail !== 'admin@user.com') {
      setSnackbarOpen(true);
      return;
    }

    try {
      const { data, error } = await supabase.from('supplies').delete().eq('supplier_id', supply.supplier_id);
      if (error) throw error;
      console.log('Deleted:', data);
      fetchSupplies();
    } catch (error) {
      console.error('Error deleting supply:', error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Suppliers
      </Typography>
      <TextField
        label="Search Supplies"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Supply
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Supplier ID</TableCell>
            <TableCell>Supplier Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Fax Number</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSupplies.map((supply) => (
            <TableRow key={supply.supplier_id}>
              <TableCell>{supply.supplier_id}</TableCell>
              <TableCell>{supply.sup_name}</TableCell>
              <TableCell>{supply.address_num}</TableCell>
              <TableCell>{supply.phone_num}</TableCell>
              <TableCell>{supply.fax_num}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(supply)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(supply)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedSupply ? 'Edit Supply' : 'Add Supply'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Supplier Name" name="sup_name" value={formValues.sup_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Address" name="address_num" value={formValues.address_num} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Phone Number" name="phone_num" value={formValues.phone_num} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
          <TextField label="Fax Number" name="fax_num" value={formValues.fax_num} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Only the admin can modify this"
      />
    </Container>
  );
};

export default Supplies;
