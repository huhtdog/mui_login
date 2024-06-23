import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button } from '@mui/material';
import PatientIcon from '@mui/icons-material/Person';
import PatientAllocationIcon from '@mui/icons-material/AssignmentInd';
import AppointmentIcon from '@mui/icons-material/Event';
import WardIcon from '@mui/icons-material/Business';
import WardRequisitionIcon from '@mui/icons-material/Assignment';
import BookAppointmentsIcon from '@mui/icons-material/EventNote';
import MedicationIcon from '@mui/icons-material/Medication';
import { Link, Outlet, useLocation } from 'react-router-dom';
import StaffIcon from '@mui/icons-material/AccountCircle';


export default function Main() {
    const [showGrid, setShowGrid] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Determine if the outlet should be displayed based on the current route
        setShowGrid(location.pathname === '/dashboard');
    }, [location.pathname]);

    const iconStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '8rem',
        color: 'rgba(255, 255, 255, 0.3)' // Adjust the opacity to make it look like a background
    };

    const buttonStyles = {
        position: 'relative',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {showGrid && (
                <Grid container spacing={3}>
                    {/* First Row */}
                    <Grid item xs={12} md={6}>
                        <Link to="/dashboard/main/staff" style={{ textDecoration: 'none' }}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Button
                                variant="contained"
                                 sx={{ ...buttonStyles, bgcolor: '#FFB6C1' }}
                                 fullWidth
                                >
                                <StaffIcon sx={iconStyles} />
                                 <StaffIcon/> Staff
                            </Button>

                            </Paper>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Link to="/dashboard/main/patient" style={{ textDecoration: 'none' }}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Button
    variant="contained"
    sx={{ ...buttonStyles, bgcolor: '#FFD700' }}
    fullWidth
>
    <PatientIcon sx={iconStyles} />
    <PatientIcon /> Patient
</Button>

                            </Paper>
                        </Link>
                    </Grid>
                    {/* Second Row */}
                    <Grid item xs={12} md={6}>
                        <Link to="/dashboard/main/appointment" style={{ textDecoration: 'none' }}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Button
    variant="contained"
    sx={{ ...buttonStyles, bgcolor: '#87CEFA' }}
    fullWidth
>
    <AppointmentIcon sx={iconStyles} />
    <AppointmentIcon /> Appointment
</Button>

                            </Paper>
                        </Link>
                    </Grid>
                    {/* Third Row */}
                    <Grid item xs={12} md={6}>
                        <Link to="/dashboard/main/ward" style={{ textDecoration: 'none' }}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Button
    variant="contained"
    sx={{ ...buttonStyles, bgcolor: '#FF69B4' }}
    fullWidth
>
    <WardIcon sx={iconStyles} />
    <WardIcon /> Ward
</Button>

                            </Paper>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Link to="/dashboard/main/wardRequisition" style={{ textDecoration: 'none' }}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Button
    variant="contained"
    sx={{ ...buttonStyles, bgcolor: '#B0E0E6' }}
    fullWidth
>
    <WardRequisitionIcon sx={iconStyles} />
    <WardRequisitionIcon /> Ward Requisition
</Button>

                            </Paper>
                        </Link>
                    </Grid>
                    {/* Fourth Row */}
                    <Grid item xs={12} md={6}>
                        <Link to="/dashboard/main/bookappointments" style={{ textDecoration: 'none' }}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Button
    variant="contained"
    sx={{ ...buttonStyles, bgcolor: '#ADFF2F' }}
    fullWidth
>
    <BookAppointmentsIcon sx={iconStyles} />
    <BookAppointmentsIcon /> Book Appointments
</Button>

                            </Paper>
                        </Link>
                    </Grid>
                    
                </Grid>
            )}
            <Outlet />
        </Container>
    );
}
