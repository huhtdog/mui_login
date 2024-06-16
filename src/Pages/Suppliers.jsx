import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [formValues, setFormValues] = useState({
        sup_name: '',
        address_num: '',
        phone_num: '',
        fax_num: ''
    });

    // Initialize Supabase client
    const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
    const supabase = createClient(supabaseUrl, supabaseKey);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const { data, error } = await supabase.from('supplier').select('*');
            if (error) {
                throw error;
            }
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error.message);
        }
    };

    const handleDialogOpen = (supplier) => {
        setSelectedSupplier(supplier);
        setOpenDialog(true);
        if (supplier) {
            setFormValues({
                sup_name: supplier.sup_name,
                address_num: supplier.address_num,
                phone_num: supplier.phone_num,
                fax_num: supplier.fax_num
            });
        } else {
            setFormValues({
                sup_name: '',
                address_num: '',
                phone_num: '',
                fax_num: ''
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
            if (!selectedSupplier) {
                // Create new supplier
                const { data, error } = await supabase.from('supplier').insert([formValues]);
                if (error) {
                    throw error;
                }
            } else {
                // Update existing supplier
                const { data, error } = await supabase.from('supplier').update(formValues).eq('supplier_id', selectedSupplier.supplier_id);
                if (error) {
                    throw error;
                }
            }
            setOpenDialog(false);
            fetchSuppliers();
            clearForm();
        } catch (error) {
            console.error('Error saving supplier:', error.message);
        }
    };

    const clearForm = () => {
        setFormValues({
            sup_name: '',
            address_num: '',
            phone_num: '',
            fax_num: ''
        });
    };

    const handleDelete = async (supplier) => {
        try {
            const { data, error } = await supabase.from('supplier').delete().eq('supplier_id', supplier.supplier_id);
            if (error) {
                throw error;
            }
            fetchSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error.message);
        }
    };

    // Retrieve the authentication token from localStorage
    const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');
    const authToken = JSON.parse(authTokenString);
    const userEmail = authToken.user.email;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Suppliers
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>Add Supplier</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Supplier ID</TableCell>
                        <TableCell>Supplier Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Fax Number</TableCell>
                        {userEmail === 'admin@user.com' && (
                            <TableCell>Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {suppliers.map((supplier) => (
                        <TableRow key={supplier.supplier_id}>
                            <TableCell>{supplier.supplier_id}</TableCell>
                            <TableCell>{supplier.sup_name}</TableCell>
                            <TableCell>{supplier.address_num}</TableCell>
                            <TableCell>{supplier.phone_num}</TableCell>
                            <TableCell>{supplier.fax_num}</TableCell>
                            {userEmail === 'admin@user.com' && (
                                <TableCell>
                                    <IconButton onClick={() => handleDialogOpen(supplier)}><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(supplier)}><Delete /></IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
                <DialogContent>
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
        </Container>
    );
}

export default Supplier;
