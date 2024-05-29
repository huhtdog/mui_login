// Signup.js
import { useNavigate } from 'react-router-dom';
import { Container, Box, Paper, TextField, Button, Typography, IconButton, InputAdornment, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SensorOccupiedRoundedIcon from '@mui/icons-material/SensorOccupiedRounded';
import '../Styles/Signup.css';

export default function Signup() {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    countryCode: '+1' // Default country code
  });

  const navigate = useNavigate(); // Add useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
    } else {
      setIsError(false);
      console.log('Form data:', formData);
      navigate('/Login'); // Navigate to login after successful signup
    }
  };

  return (
    <Box sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <Container maxWidth="xs" component={Paper} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <Box width="100%">
          <TextField
            error={isError && !formData.firstName}
            helperText={isError && !formData.firstName ? "Invalid First Name" : ""}
            fullWidth
            label="Full Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Box>
        <Box width="100%">
          <TextField
            error={isError && !formData.lastName}
            helperText={isError && !formData.lastName ? "Invalid Last Name" : ""}
            fullWidth
            label="Username"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Box>
        <Box width="100%">
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box>
        <Box width="100%" sx={{ display: 'flex', alignItems: 'center' }}>
          <Select
            fullWidth
            value={formData.countryCode}
            onChange={handleChange}
            name="countryCode"
            displayEmpty
            inputProps={{ 'aria-label': 'Select Country Code' }}
          >
            <MenuItem value="+1">+1 (USA)</MenuItem>
            <MenuItem value="+63">+63 (Philippines)</MenuItem>
            {/* Add more country codes as needed */}
          </Select>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Box>
        <Box width="100%">
          <TextField
            error={isError && !formData.password}
            helperText={isError && !formData.password ? "Invalid Password" : ""}
            fullWidth
            label="Make a Password"
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box width="100%">
          <TextField
            error={isError && formData.password !== formData.confirmPassword}
            helperText={isError && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
            fullWidth
            label="Confirm Password"
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box width="100%" mt={2}>
          <Button
            fullWidth
            onClick={validate}
            variant="contained"
            endIcon={<SensorOccupiedRoundedIcon />}
          >
            Sign Up
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
