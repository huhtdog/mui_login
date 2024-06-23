import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Waitinglist() {
  // Initialize Supabase client
  const supabaseUrl = 'https://ytegbeireyjzmurrpbuz.supabase.co'; // Replace with your Supabase URL
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWdiZWlyZXlqem11cnJwYnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTQ4ODYsImV4cCI6MjAzMzY5MDg4Nn0.0R9UADmHOMauVXfpDiCBFLLlv7WWsgA8rf1I8IIaBig'; // Replace with your Supabase key
  const supabase = createClient(supabaseUrl, supabaseKey);
  const navigate = useNavigate();

  const [waitingList, setWaitingList] = useState([]);
  const { register: registerInpatient, handleSubmit: handleSubmitInpatient, reset: resetInpatient } = useForm();
  const { register: registerOutpatient, handleSubmit: handleSubmitOutpatient, reset: resetOutpatient, setValue: setOutpatientValue } = useForm();
  const [selectedId, setSelectedId] = useState(null);
  const [openInpatient, setOpenInpatient] = useState(false);
  const [openOutpatient, setOpenOutpatient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('in_patients')
        .select('*');
      
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setWaitingList(data);
      }
    };

    fetchData();
  }, []);

  const handleInpatient = (id) => {
    console.log(`Inpatient action for ID: ${id}`);
    setSelectedId(id);
    setOpenInpatient(true);
  };

  const handleOutpatient = (id, date, appointmentTime) => {
    console.log(`Outpatient action for ID: ${id}`);
    setSelectedId(id);
    setOpenOutpatient(true);
    setOutpatientValue('appointmentTime', appointmentTime);
    setOutpatientValue('appointmentDate', date);
  };

  const handleCloseInpatient = () => {
    setOpenInpatient(false);
  };

  const handleCloseOutpatient = () => {
    setOpenOutpatient(false);
  };

  const onSubmitInpatient = async (data) => {
    console.log('Inpatient form data:', data);
    const { error } = await supabase
      .from('in_patients')
      .insert([data]);

    if (error) {
      console.error('Error inserting inpatient data:', error);
    } else {
      console.log('Inpatient data saved successfully');
    }
    setOpenInpatient(false);
  };

  const onSubmitOutpatient = async (data) => {
    console.log('Outpatient form data:', data);
    // Implement logic to save outpatient data to the database
    setOpenOutpatient(false);
  };

  const handleBackToPatient = () => {
    navigate('/dashboard/main/patient');
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToPatient}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PatientNumber</TableCell>
              <TableCell>Date Expected Leave</TableCell>
              <TableCell>Actual Date Patient Left</TableCell>
              <TableCell>Next of Kin Name</TableCell>
              <TableCell>Next of Kin Relationship</TableCell>
              <TableCell>Next of Kin Telephone</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {waitingList.map((row) => (
              <TableRow key={row.patient_number}>
                <TableCell>{row.patient_number}</TableCell>
                <TableCell>{row.date_expected_leave}</TableCell>
                <TableCell>{row.actual_date_patient_left}</TableCell>
                <TableCell>{row.next_of_kin_name}</TableCell>
                <TableCell>{row.next_of_kin_relationship}</TableCell>
                <TableCell>{row.next_of_kin_telephone}</TableCell>
                {/* <TableCell>{row.ward_number}</TableCell> */}
                {/* <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleInpatient(row.waitinglist_number)}
                    sx={{ mr: 1, width: 100, marginBottom: 1 }} // Set a fixed width
                  >
                    Inpatient
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOutpatient(row.waitinglist_number, row.date, row.appointment_time)}
                    sx={{ width: 100 }} // Set the same fixed width
                  >
                    Outpatient
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inpatient Dialog */}
      <Dialog open={openInpatient && selectedId !== null} onClose={handleCloseInpatient}>
        <DialogTitle>Inpatient Form</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitInpatient(onSubmitInpatient)}>
            <TextField {...registerInpatient('patient_number')} label="Patient Number" fullWidth margin="normal" />
            <TextField {...registerInpatient('date_expected_leave')} label="Expected Leave Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField {...registerInpatient('actual_date_patient_left')} label="Actual Date Patient Left" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField {...registerInpatient('next_of_kin_name')} label="Next of Kin Name" fullWidth margin="normal" />
            <TextField {...registerInpatient('next_of_kin_address')} label="Next of Kin Address" fullWidth margin="normal" />
            <TextField {...registerInpatient('next_of_kin_relationship')} label="Next of Kin Relationship" fullWidth margin="normal" />
            <TextField {...registerInpatient('next_of_kin_telephone')} label="Next of Kin Telephone" fullWidth margin="normal" />
            <TextField {...registerInpatient('ward_number')} label="Ward Number" fullWidth margin="normal" />
            <DialogActions>
              <Button onClick={handleCloseInpatient} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Outpatient Dialog */}
      <Dialog open={openOutpatient && selectedId !== null} onClose={handleCloseOutpatient}>
        <DialogTitle>Outpatient Form</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitOutpatient(onSubmitOutpatient)}>
            <TextField {...registerOutpatient('patient_number')} label="Patient Number" fullWidth margin="normal" />
            <TextField {...registerOutpatient('appointmentTime')} label="Appointment Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField {...registerOutpatient('appointmentDate')} label="Appointment Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <DialogActions>
              <Button onClick={handleCloseOutpatient} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog> 
      
    </Paper>
  )     
}
