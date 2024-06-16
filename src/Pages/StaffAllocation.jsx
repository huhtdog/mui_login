// import { Paper } from "@mui/material"
// export default function StaffAllocation() {
//     // Retrieve the authentication token from localStorage
// const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');

// // Parse the JSON string into an object
// const authToken = JSON.parse(authTokenString);

// // Extract the email property from the authToken object
// const userEmail = authToken.user.email;

// // Log the email to the console bisan@unsa.com
// console.log('User email:', userEmail);

//    // Retrieve the authentication token from localStorage
//    const authTokenString2 = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');

//    // Parse the JSON string into an object
//    const authToken2 = JSON.parse(authTokenString);
   
//    // Extract the email property from the authToken object
//    const userEmail2 = authToken.user.email;
   
//    // Log the email to the console bisan@unsa.com
//    console.log('User email:', userEmail2);

//   return (
//     <Paper sx={{p:50}}>shessasdasd  hehehehe4h</Paper>
//   )     
// }

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function StaffAllocation() {
    const [allocations, setAllocations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAllocation, setSelectedAllocation] = useState(null);
    const [formValues, setFormValues] = useState({
        staff_number: '',
        ward_number: '',
        shift: '',
    });

    // Initialize Supabase client
    const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
    const supabase = createClient(supabaseUrl, supabaseKey);

    useEffect(() => {
        fetchAllocations();
    }, []);

    const fetchAllocations = async () => {
        try {
            const { data, error } = await supabase.from('staff_allocation').select('*');
            if (error) {
                throw error;
            }
            setAllocations(data);
        } catch (error) {
            console.error('Error fetching allocations:', error.message);
        }
    };

    const handleDialogOpen = (allocation) => {
        setSelectedAllocation(allocation);
        setOpenDialog(true);
        if (allocation) {
            setFormValues({
                staff_number: allocation.staff_number,
                ward_number: allocation.ward_number,
                shift: allocation.shift,
            });
        } else {
            setFormValues({
                staff_number: '',
                ward_number: '',
                shift: '',
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
            if (!selectedAllocation) {
                // Create new allocation
                const { data, error } = await supabase.from('staff_allocation').insert([formValues]);
                if (error) {
                    throw error;
                }
            } else {
                // Update existing allocation
                const { data, error } = await supabase.from('staff_allocation').update(formValues).eq('id', selectedAllocation.id);
                if (error) {
                    throw error;
                }
            }
            setOpenDialog(false);
            fetchAllocations();
            clearForm();
        } catch (error) {
            console.error('Error saving allocation:', error.message);
        }
    };

    const clearForm = () => {
        setFormValues({
            staff_number: '',
            ward_number: '',
            shift: '',
        });
    };

    const handleDelete = async (allocation) => {
        try {
            const { data, error } = await supabase.from('staff_allocation').delete().eq('id', allocation.id);
            if (error) {
                throw error;
            }
            fetchAllocations();
        } catch (error) {
            console.error('Error deleting allocation:', error.message);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Staff Allocation
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>Add Allocation</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Staff Number</TableCell>
                        <TableCell>Ward Number</TableCell>
                        <TableCell>Shift</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allocations.map((allocation) => (
                        <TableRow key={allocation.id}>
                            <TableCell>{allocation.staff_number}</TableCell>
                            <TableCell>{allocation.ward_number}</TableCell>
                            <TableCell>{allocation.shift}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDialogOpen(allocation)}><Edit /></IconButton>
                                <IconButton onClick={() => handleDelete(allocation)}><Delete /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{selectedAllocation ? 'Edit Allocation' : 'Add Allocation'}</DialogTitle>
                <DialogContent>
                    <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
                    <TextField label="Ward Number" name="ward_number" value={formValues.ward_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
                    <TextField label="Shift" name="shift" value={formValues.shift} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleFormSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default StaffAllocation;

