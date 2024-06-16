import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Container, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function WorkExperience() {
    const [experiences, setExperiences] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [formValues, setFormValues] = useState({
        staff_number: '',
        position: '',
        start_date: '',
        finish_date: '',
        organization: ''
    });

    // Initialize Supabase client
    const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
    const supabase = createClient(supabaseUrl, supabaseKey);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const { data, error } = await supabase.from('workexperience').select('*');
            if (error) {
                throw error;
            }
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error.message);
        }
    };

    const handleDialogOpen = (experience) => {
        setSelectedExperience(experience);
        setOpenDialog(true);
        if (experience) {
            setFormValues({
                staff_number: experience.staff_number,
                position: experience.position,
                start_date: experience.start_date,
                finish_date: experience.finish_date,
                organization: experience.organization
            });
        } else {
            setFormValues({
                staff_number: '',
                position: '',
                start_date: '',
                finish_date: '',
                organization: ''
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
            if (!selectedExperience) {
                // Create new experience
                const { data, error } = await supabase.from('workexperience').insert([formValues]);
                if (error) {
                    throw error;
                }
            } else {
                // Update existing experience
                const { data, error } = await supabase.from('workexperience').update(formValues).eq('experience_id', selectedExperience.experience_id);
                if (error) {
                    throw error;
                }
            }
            setOpenDialog(false);
            fetchExperiences();
            clearForm();
        } catch (error) {
            console.error('Error saving experience:', error.message);
        }
    };

    const clearForm = () => {
        setFormValues({
            staff_number: '',
            position: '',
            start_date: '',
            finish_date: '',
            organization: ''
        });
    };

    const handleDelete = async (experience) => {
        try {
            const { data, error } = await supabase.from('workexperience').delete().eq('experience_id', experience.experience_id);
            if (error) {
                throw error;
            }
            fetchExperiences();
        } catch (error) {
            console.error('Error deleting experience:', error.message);
        }
    };

    // Retrieve the authentication token from localStorage
    const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');
    const authToken = JSON.parse(authTokenString);
    const userEmail = authToken.user.email;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Work Experience
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>Add Experience</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Experience ID</TableCell>
                        <TableCell>Staff Number</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Finish Date</TableCell>
                        <TableCell>Organization</TableCell>
                        {userEmail === 'admin@user.com' && (
                            <TableCell>Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {experiences.map((experience) => (
                        <TableRow key={experience.experience_id}>
                            <TableCell>{experience.experience_id}</TableCell>
                            <TableCell>{experience.staff_number}</TableCell>
                            <TableCell>{experience.position}</TableCell>
                            <TableCell>{experience.start_date}</TableCell>
                            <TableCell>{experience.finish_date}</TableCell>
                            <TableCell>{experience.organization}</TableCell>
                            {userEmail === 'admin@user.com' && (
                                <TableCell>
                                    <IconButton onClick={() => handleDialogOpen(experience)}><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(experience)}><Delete /></IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{selectedExperience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                <DialogContent>
                    <TextField label="Staff Number" name="staff_number" value={formValues.staff_number} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
                    <TextField label="Position" name="position" value={formValues.position} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
                    <TextField label="Start Date" type="date" name="start_date" value={formValues.start_date} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} InputLabelProps={{ shrink: true }} />
                    <TextField label="Finish Date" type="date" name="finish_date" value={formValues.finish_date} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} InputLabelProps={{ shrink: true }} />
                    <TextField label="Organization" name="organization" value={formValues.organization} onChange={handleChange} fullWidth sx={{ marginTop: '5px' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleFormSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default WorkExperience;
