// import { Paper } from "@mui/material"
// export default function PharmaceuticalSupplies() {
//   return (
//     <Paper sx={{p:30}}>shessh21312312</Paper>
//   )     
// }

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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
const supabase = createClient(supabaseUrl, supabaseKey);

const PharmaceuticalSupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [formValues, setFormValues] = useState({
    drug_name: '',
    dosage: '',
    method_of_administration: '',
    cost_per_unit: '',
  });

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmaceuticalsupplies')
        .select('*');
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
        dosage: supply.dosage,
        method_of_administration: supply.method_of_administration,
        cost_per_unit: supply.cost_per_unit,
      });
    } else {
      setFormValues({
        drug_name: '',
        dosage: '',
        method_of_administration: '',
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
        const { error } = await supabase
          .from('pharmaceuticalsupplies')
          .insert([formValues]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing supply
        const { error } = await supabase
          .from('pharmaceuticalsupplies')
          .update(formValues)
          .eq('drug_number', selectedSupply.drug_number); // Assuming drug_number is the identifier
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
      dosage: '',
      method_of_administration: '',
      cost_per_unit: '',
    });
  };

  const handleDelete = async (supply) => {
    try {
      const { error } = await supabase
        .from('pharmaceuticalsupplies')
        .delete()
        .eq('drug_number', supply.drug_number); // Assuming drug_number is the identifier
      if (error) {
        throw error;
      }
      fetchSupplies();
    } catch (error) {
      console.error('Error deleting supply:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pharmaceutical Supplies
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Supply
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Drug Name</TableCell>
            <TableCell>Dosage</TableCell>
            <TableCell>Method of Administration</TableCell>
            <TableCell>Cost per Unit</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supplies.map((supply) => (
            <TableRow key={supply.drug_number}>
              <TableCell>{supply.drug_name}</TableCell>
              <TableCell>{supply.dosage}</TableCell>
              <TableCell>{supply.method_of_administration}</TableCell>
              <TableCell>{supply.cost_per_unit}</TableCell>
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
          <TextField label="Drug Name" name="drug_name" value={formValues.drug_name} onChange={handleChange} fullWidth />
          <TextField label="Dosage" name="dosage" value={formValues.dosage} onChange={handleChange} fullWidth />
          <TextField label="Method of Administration" name="method_of_administration" value={formValues.method_of_administration} onChange={handleChange} fullWidth />
          <TextField label="Cost per Unit" name="cost_per_unit" value={formValues.cost_per_unit} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PharmaceuticalSupplies;
