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
  const { register: registerPatient, handleSubmit: handleSubmitPatient, reset: resetPatient } = useForm();
  const { register: registerInpatient, handleSubmit: handleSubmitInpatient, reset: resetInpatient } = useForm();
  const { register: registerOutpatient, handleSubmit: handleSubmitOutpatient, reset: resetOutpatient, setValue: setOutpatientValue } = useForm();
  const [selectedId, setSelectedId] = useState(null);
  const [openInpatient, setOpenInpatient] = useState(false);
  const [openOutpatient, setOpenOutpatient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('waiting_list')
        .select('*')
        .eq('isDeleted', false);
      
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
    // Insert data into the in_patient table
    const { error: insertError } = await supabase
      .from('in_patients')
      .insert({
        patient_number: data.patientNumber,
        date_expected_leave: data.dateExpectedLeave,
        actual_date_patient_left: data.actualDatePatientLeft,
        next_of_kin_name: data.nextOfKinName,
        next_of_kin_address: data.nextOfKinAddress,
        next_of_kin_relationship: data.nextOfKinRelationship,
        next_of_kin_telephone: data.nextOfKinTelephone,
      });

    if (insertError) {
      console.error('Error inserting inpatient data:', insertError);
    } else {
      // Update the isDeleted field in the waiting_list table
      const { error: updateError } = await supabase
        .from('waiting_list')
        .update({ isDeleted: true })
        .eq('waitinglist_number', selectedId);

      if (updateError) {
        console.error('Error updating waiting list:', updateError);
      }
    }
    navigate('/dashboard/main/patient/inpatient');
    setOpenInpatient(false);
    // Implement logic to save inpatient data to the database
  };

  const onSubmitOutpatient = async (data) => {
    console.log('Outpatient form data:', data);
    // Insert data into the out_patient table
    const { error: insertError } = await supabase
      .from('out_patient')
      .insert({
        patient_number: data.patientNumber,
        appointment_time: data.appointmentTime,
        appointment_date: data.appointmentDate,
      });

    if (insertError) {
      console.error('Error inserting outpatient data:', insertError);
    } else {
      // Update the isDeleted field in the waiting_list table
      const { error: updateError } = await supabase
        .from('waiting_list')
        .update({ isDeleted: true })
        .eq('waitinglist_number', selectedId);

      if (updateError) {
        console.error('Error updating waiting list:', updateError);
      }
    }
    navigate('/dashboard/main/patient/outpatient');
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
              <TableCell>Waiting List Number</TableCell>
              <TableCell>Appointment Number</TableCell>
              <TableCell>Clinic Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Appointment Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {waitingList.map((row) => (
              <TableRow key={row.waitinglist_number}>
                <TableCell>{row.waitinglist_number}</TableCell>
                <TableCell>{row.appointment_number}</TableCell>
                <TableCell>{row.clinic_number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.appointment_time}</TableCell>
                <TableCell>
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
                </TableCell>
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
            <TextField {...registerInpatient('patientNumber')} label="Patient Number" fullWidth margin="normal" />
            <TextField {...registerInpatient('dateExpectedLeave')} label="Expected Leave Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField {...registerInpatient('actualDatePatientLeft')} label="Actual Date Patient Left" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField {...registerInpatient('nextOfKinName')} label="Next of Kin Name" fullWidth margin="normal" />
            <TextField {...registerInpatient('nextOfKinAddress')} label="Next of Kin Address" fullWidth margin="normal" />
            <TextField {...registerInpatient('nextOfKinRelationship')} label="Next of Kin Relationship" fullWidth margin="normal" />
            <TextField {...registerInpatient('nextOfKinTelephone')} label="Next of Kin Telephone" fullWidth margin="normal" />
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
            <TextField {...registerOutpatient('patientNumber')} label="Patient Number" fullWidth margin="normal" />
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
