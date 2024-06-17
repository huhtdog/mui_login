import React from 'react';
import { Container, Grid, Paper, Button } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel'; // In Patient icon
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'; // Out Patient icon
import PeopleIcon from '@mui/icons-material/People'; // All Patient icon
import ListAltIcon from '@mui/icons-material/ListAlt'; // Waiting List icon
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formValues, setFormValues] = useState({
    patient_number: '', // Include patient_number in formValues
    first_name: '',
    last_name: '',
    address: '',
    telephone_number: '',
    date_of_birth: '',
    sex: '',
    marital_status: '',
    date_registered: '',
  });

  React.useEffect(() => {
    setShowGrid(location.pathname === '/dashboard/main/patient');
  }, [location.pathname]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*');
      if (error) {
        throw error;
      }
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  };

  const handleDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
    if (patient) {
      setFormValues({
        patient_number: patient.patient_number, // Set patient_number when editing
        first_name: patient.first_name,
        last_name: patient.last_name,
        address: patient.address,
        telephone_number: patient.telephone_number,
        date_of_birth: patient.date_of_birth,
        sex: patient.sex,
        marital_status: patient.marital_status,
        date_registered: patient.date_registered,
      });
    } else {
      setFormValues({
        patient_number: '', // Reset patient_number when adding new patient
        first_name: '',
        last_name: '',
        address: '',
        telephone_number: '',
        date_of_birth: '',
        sex: '',
        marital_status: '',
        date_registered: '',
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
      const valuesToSubmit = { ...formValues };
      if (!selectedPatient) {
        // Remove patient_number from valuesToSubmit if it's a new patient
        delete valuesToSubmit.patient_number;

        // Create new patient
        const { data, error } = await supabase
          .from('patients')
          .insert([valuesToSubmit]);
        if (error) {
          throw error;
        }
      } else {
        // Update existing patient
        const { data, error } = await supabase
          .from('patients')
          .update(valuesToSubmit)
          .eq('patient_number', selectedPatient.patient_number);
        if (error) {
          throw error;
        }
      }
      setOpenDialog(false);
      await fetchPatients();
      clearForm();
    } catch (error) {
      console.error('Error saving patient:', error.message);
    }
  };

  const clearForm = () => {
    setFormValues({
      patient_number: '', // Reset patient_number after form submission
      first_name: '',
      last_name: '',
      address: '',
      telephone_number: '',
      date_of_birth: '',
      sex: '',
      marital_status: '',
      date_registered: '',
    });
  };

  const handleDelete = async (patient) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .delete()
        .eq('patient_number', patient.patient_number);
      if (error) {
        throw error;
      }
      await fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)}>
        Add Patient
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Number</TableCell> {/* Display Patient Number */}
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Telephone Number</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Sex</TableCell>
            <TableCell>Marital Status</TableCell>
            <TableCell>Date Registered</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.patient_number}>
              <TableCell>{patient.patient_number}</TableCell> {/* Display Patient Number */}
              <TableCell>{patient.first_name}</TableCell>
              <TableCell>{patient.last_name}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.telephone_number}</TableCell>
              <TableCell>{patient.date_of_birth}</TableCell>
              <TableCell>{patient.sex}</TableCell>
              <TableCell>{patient.marital_status}</TableCell>
              <TableCell>{patient.date_registered}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDialogOpen(patient)} aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(patient)} aria-label="delete">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <TextField label="First Name" name="first_name" value={formValues.first_name} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Last Name" name="last_name" value={formValues.last_name} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Address" name="address" value={formValues.address} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Telephone Number" name="telephone_number" value={formValues.telephone_number} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Date of Birth" name="date_of_birth" type="date" value={formValues.date_of_birth} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="Sex" name="sex" value={formValues.sex} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Marital Status" name="marital_status" value={formValues.marital_status} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Date Registered" name="date_registered" type="date" value={formValues.date_registered} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
);
}
