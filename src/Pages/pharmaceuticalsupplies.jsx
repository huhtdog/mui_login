// import { Paper } from "@mui/material"
// export default function PharmaceuticalSupplies() {
//   return (
//     <Paper sx={{p:30}}>shessh21312312</Paper>
//   )     
// }

import React, { useState, useEffect } from 'react';
// import { supabase } from '../Supabase2/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { Paper } from "@mui/material";
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function PharmaceuticalSupplies() {
    const [supplies, setSupplies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSupply, setSelectedSupply] = useState(null);
    const [formValues, setFormValues] = useState({
      drug_name: '',
      description: '',
      dosage: '',
      method_of_administration: '',
      quantity_in_stock: '',
      reorder_level: '',
      cost_per_unit: '',
    });

    // Initialize Supabase client
    const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
    const supabase = createClient(supabaseUrl, supabaseKey);
  
    useEffect(() => {
      fetchSupplies();
    }, []);
  
    const fetchSupplies = async () => {
      try {
        const { data, error } = await supabase.from('pharmaceuticalsupplies').select('*');
        if (error) {
          throw error;
        }
        setSupplies(data);
      } catch (error) {
        console.error('Error fetching supplies:', error.message);
      }
    };
  
    const handleDialogOpen = (supply) => {
      setSelectedSupply(supply);
      setOpenDialog(true);
      if (supply) {
        setFormValues({
          drug_name: supply.drug_name,
          description: supply.description,
          dosage: supply.dosage,
          method_of_administration: supply.method_of_administration,
          quantity_in_stock: supply.quantity_in_stock,
          reorder_level: supply.reorder_level,
          cost_per_unit: supply.cost_per_unit,
        });
      } else {
        setFormValues({
          drug_name: '',
          description: '',
          dosage: '',
          method_of_administration: '',
          quantity_in_stock: '',
          reorder_level: '',
          cost_per_unit: '',
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
        if (!selectedSupply) {
          // Create new supply
          const { data, error } = await supabase.from('pharmaceuticalsupplies').insert([formValues]);
          if (error) {
            throw error;
          }
        } else {
          // Update existing supply
          const { data, error } = await supabase.from('pharmaceuticalsupplies').update(formValues).eq('drug_number', selectedSupply.drug_number);
          if (error) {
            throw error;
          }
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
        drug_name: '',
        description: '',
        dosage: '',
        method_of_administration: '',
        quantity_in_stock: '',
        reorder_level: '',
        cost_per_unit: '',
      });
    };
  
    const handleDelete = async (supply) => {
      try {
        const { data, error } = await supabase.from('pharmaceuticalsupplies').delete().eq('drug_number', supply.drug_number);
        if (error) {
          throw error;
        }
        fetchSupplies();
      } catch (error) {
        console.error('Error deleting supply:', error.message);
      }
    };

    // Retrieve the authentication token from localStorage
const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');

// Parse the JSON string into an object
const authToken = JSON.parse(authTokenString);

// Extract the email property from the authToken object
const userEmail = authToken.user.email;
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pharmaceutical Supplies
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>Add Supply</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Drug Number</TableCell>
            <TableCell>Drug Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Dosage</TableCell>
            <TableCell>Method of Administration</TableCell>
            <TableCell>Quantity in Stock</TableCell>
            <TableCell>Reorder Level</TableCell>
            <TableCell>Cost per Unit</TableCell>
            {userEmail == 'admin@user.com' &&(
            <TableCell>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {supplies.map((supply) => (
            <TableRow key={supply.drug_number}>
              <TableCell>{supply.drug_number}</TableCell>
              <TableCell>{supply.drug_name}</TableCell>
              <TableCell>{supply.description}</TableCell>
              <TableCell>{supply.dosage}</TableCell>
              <TableCell>{supply.method_of_administration}</TableCell>
              <TableCell>{supply.quantity_in_stock}</TableCell>
              <TableCell>{supply.reorder_level}</TableCell>
              <TableCell>{supply.cost_per_unit}</TableCell>
              {userEmail == 'admin@user.com' &&(
                <TableCell>
                <IconButton onClick={() => handleDialogOpen(supply)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(supply)}><Delete /></IconButton>
                </TableCell>
              )} 
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedSupply ? 'Edit Supply' : 'Add Supply'}</DialogTitle>
        <DialogContent>
          <TextField label="Drug Name" name="drug_name" value={formValues.drug_name} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
          <TextField label="Description" name="description" value={formValues.description} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
          <TextField label="Dosage" name="dosage" value={formValues.dosage} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
          <TextField label="Method of Administration" name="method_of_administration" value={formValues.method_of_administration} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
          <TextField label="Quantity in Stock" name="quantity_in_stock" value={formValues.quantity_in_stock} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
          <TextField label="Reorder Level" name="reorder_level" value={formValues.reorder_level} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
          <TextField label="Cost per Unit" name="cost_per_unit" value={formValues.cost_per_unit} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

}
export default PharmaceuticalSupplies;