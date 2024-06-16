import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MasksIcon from '@mui/icons-material/Masks';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Main() {
    
    const [showGrid, setShowGrid] = useState(true);
    const location = useLocation();
    const wew = 0;

    useEffect(() => {
        // Determine if the outlet should be displayed based on the current route
        setShowGrid(location.pathname === '/dashboard');
    }, [location.pathname]);

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
                                sx={{ bgcolor: '#FFB6C1', height: '200px' }}
                                fullWidth   
                            >
                                <LocalHospitalIcon/> Staff
                            </Button>
                        </Paper>
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="/dashboard/main/patient" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#FFD700', height: '200px' }}
                            fullWidth
                        >
                            <MedicalServicesIcon /> PATIENT
                        </Button>
                    </Paper>
                    </Link>
                </Grid>
                {/* Second Row */}
                <Grid item xs={12} md={6}>
                    <Link to="/dashboard/main/patientAllocation" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#20B2AA', height: '200px' }}
                            fullWidth
                        >
                            <HealingIcon /> patient allocation
                        </Button>
                    </Paper>
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="/dashboard/main/appointment" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#87CEFA', height: '200px' }}
                            fullWidth
                        >
                            <MonitorHeartIcon /> appointment
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
                            sx={{ bgcolor: '#FF69B4', height: '200px' }}
                            fullWidth
                        >
                            <MasksIcon /> ward
                        </Button>
                    </Paper>
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="/dashboard/main/wardRequisition" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#B0E0E6', height: '200px' }}
                            fullWidth
                        >
                            <HealthAndSafetyIcon /> Ward Requisition
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
                            sx={{ bgcolor: '#ADFF2F', height: '200px' }}
                            fullWidth
                        >
                            <MedicationIcon /> Book Appointments
                        </Button>
                    </Paper>
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="/dashboard/main/button8" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#FF6347', height: '200px' }}
                            fullWidth
                        >
                            <VaccinesIcon /> Button 8
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
