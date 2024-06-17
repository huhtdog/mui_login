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

// Supabase credentials
const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig';
const supabase = createClient(supabaseUrl, supabaseKey);

const SurgicalNonSurgicalItems = () => {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    item_number: '',
    item_description: '',
    quantity_in_stock: '',
    reorder_level: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('surgical_nonsurgical')
        .select('*');
      if (error) {
        throw error;
      }
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  const handleDialogOpen = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
    if (item) {
      setFormValues({
        item_number: item.item_number,
        item_description: item.item_description || '',
        quantity_in_stock: item.quantity_in_stock || '',
        reorder_level: item.reorder_level || '',
      });
    } else {
      setFormValues({
        item_number: '',
        item_description: '',
        quantity_in_stock: '',
        reorder_level: '',
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
      if (!selectedItem) {
        // Create new item
        const { data, error } = await supabase
          .from('surgical_nonsurgical')
          .insert(formValues);
        if (error) {
          throw error;
        }
      } else {
        // Update existing item
        const { data, error } = await supabase
          .from('surgical_nonsurgical')
          .update(formValues)
          .eq('item_number', selectedItem.item_number);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      fetchItems();
      clearForm();
    } catch (error) {
      console.error('Error saving item:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      item_number: '',
      item_description: '',
      quantity_in_stock: '',
      reorder_level: '',
    });
  };

  const handleDelete = async (item) => {
    try {
      const { data, error } = await supabase
        .from('surgical_nonsurgical')
        .delete()
        .eq('item_number', item.item_number);
      if (error) {
        throw error;
      }
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Surgical and Non-surgical Items
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Item
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Number</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell>Quantity in Stock</TableCell>
            <TableCell>Reorder Level</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.item_number}>
              <TableCell>{item.item_number}</TableCell>
              <TableCell>{item.item_description}</TableCell>
              <TableCell>{item.quantity_in_stock}</TableCell>
              <TableCell>{item.reorder_level}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(item)} aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item)} aria-label="delete">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField label="Item Number" name="item_number" value={formValues.item_number} onChange={handleChange} fullWidth />
          <TextField label="Item Description" name="item_description" value={formValues.item_description} onChange={handleChange} fullWidth />
          <TextField label="Quantity in Stock" name="quantity_in_stock" value={formValues.quantity_in_stock} onChange={handleChange} fullWidth />
          <TextField label="Reorder Level" name="reorder_level" value={formValues.reorder_level} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SurgicalNonSurgicalItems;
