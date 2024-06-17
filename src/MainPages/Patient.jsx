import React from 'react';
import { Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Patient() {
  const navigate = useNavigate();

  const handleInPatientClick = () => {
    navigate('/in-patient');
  };

  const handleOutPatientClick = () => {
    navigate('/out-patient');
  };

  const handlePatientClick = () => {
    navigate('/patient');
  };

  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, width: '80%', height: '80px', fontSize: '24px' }}
        onClick={handleInPatientClick}
      >
        IN PATIENT
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2, width: '80%', height: '80px', fontSize: '24px' }}
        onClick={handleOutPatientClick}
      >
        OUT PATIENT
      </Button>
      <Button
        variant="contained"
        color="error"
        sx={{ width: '80%', height: '80px', fontSize: '24px' }}
        onClick={handlePatientClick}
      >
        ALLPATIENT
      </Button>
    </Paper>
  );
}
