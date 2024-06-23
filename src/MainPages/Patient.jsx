import React from 'react';
import { Container, Grid, Paper, Button } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel'; // In Patient icon
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'; // Out Patient icon
import PeopleIcon from '@mui/icons-material/People'; // All Patient icon
import ListAltIcon from '@mui/icons-material/ListAlt'; // Waiting List icon
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Patient() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGrid, setShowGrid] = React.useState(true);

  React.useEffect(() => {
    setShowGrid(location.pathname === '/dashboard/main/patient');
  }, [location.pathname]);

  const handlePatientClick = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {showGrid && (
        <Grid container spacing={3}>
          {/* First Row */}
          <Grid item xs={12} md={6}>
            <Link to="/dashboard/main/patient/inpatient" style={{ textDecoration: 'none' }}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#FFB6C1', height: '200px' }}
                  fullWidth
                >
                  <HotelIcon /> IN PATIENT
                </Button>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link to="/dashboard/main/patient/outpatient" style={{ textDecoration: 'none' }}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#FFD700', height: '200px' }}
                  fullWidth
                >
                  <LocalPharmacyIcon /> OUT PATIENT
                </Button>
              </Paper>
            </Link>
          </Grid>
          {/* Second Row */}
          <Grid item xs={12} md={6}>
            <Link to="/dashboard/main/patient/allpatient" style={{ textDecoration: 'none' }}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#20B2AA', height: '200px' }}
                  fullWidth
                >
                  <PeopleIcon /> ALL PATIENT
                </Button>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link to="/dashboard/main/patient/waitinglist" style={{ textDecoration: 'none' }}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#87CEFA', height: '200px' }}
                  fullWidth
                >
                  <ListAltIcon /> WAITING LIST
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
