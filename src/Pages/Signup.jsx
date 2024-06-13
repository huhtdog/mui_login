import { useNavigate } from 'react-router-dom';
import { Container, Box, Paper, TextField, Button, Typography, IconButton, InputAdornment, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SensorOccupiedRoundedIcon from '@mui/icons-material/SensorOccupiedRounded';
import supabase from '../Services/Supabase'; // Assuming you have Supabase initialized

export default function Signup() {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+1' // Default country code
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      return;
    }

    setIsError(false);

    // Sign up the user
    const { error } = await supabase.auth.signUp({
      email: formData.email, // Assuming you add email field in your form
      password: formData.password,
      options: {
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      setIsError(true);
      return;
    }

    // On successful signup, navigate to login and proceed to login
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (loginError) {
      console.error('Login error:', loginError.message);
      setIsError(true);
      return;
    }

    if (data) {
      navigate('/dashboard'); // Navigate to dashboard after successful login
    }
  };

  const handleLogin = async () => {
    navigate('/')
  }

  return (
    <Box sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: 'black', color: 'white' }}>
      <Container maxWidth="xs" component={Paper} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', color: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'green' }}>Sign Up</Typography>
        <Box width="100%" sx={{ mb: 2 }}>
          <TextField
            error={isError && !formData.firstName}
            helperText={isError && !formData.firstName ? "Invalid First Name" : ""}
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          />
        </Box>
        <Box width="100%" sx={{ mb: 2 }}>
          <TextField
            error={isError && !formData.lastName}
            helperText={isError && !formData.lastName ? "Invalid Last Name" : ""}
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          />
        </Box>
        <Box width="100%" sx={{ mb: 2 }}>
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box>
        <Box width="100%" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Select
            value={formData.countryCode}
            onChange={handleChange}
            name="countryCode"
            displayEmpty
            inputProps={{ 'aria-label': 'Select Country Code' }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
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
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          />
        </Box>
        <Box width="100%" sx={{ mb: 2 }}>
          <TextField
            error={isError && !formData.email}
            helperText={isError && !formData.email ? "Invalid Email" : ""}
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          />
        </Box>
        <Box width="100%" sx={{ mb: 2 }}>
          <TextField
            error={isError && !formData.password}
            helperText={isError && !formData.password ? "Invalid Password" : ""}
            fullWidth
            label="Password"
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'white' }}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          />
        </Box>
        <Box width="100%" sx={{ mb: 2 }}>
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'white' }}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'green' },
                '&.Mui-focused fieldset': { borderColor: 'green' },
              }
            }}
          />
        </Box>
        <Box width="100%" mt={2}>
          <Button
            fullWidth
            onClick={handleSignup}
            variant="contained"
            endIcon={<SensorOccupiedRoundedIcon />}
            sx={{ backgroundColor: 'green', color: 'black', '&:hover': { backgroundColor: 'darkgreen' } }}
          >
            Sign Up
          </Button>
          <Button
            fullWidth
            onClick={handleLogin}
            variant="contained"
            endIcon={<SensorOccupiedRoundedIcon />}
            sx={{ backgroundColor: 'green', color: 'black', '&:hover': { backgroundColor: 'darkgreen' }, marginTop: 2 }}
          >
            Log in
          </Button>
        
        </Box>
      </Container>
    </Box>
  );
}
