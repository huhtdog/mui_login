// Login.js
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Paper, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { useState } from 'react';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../Styles/Login.css';

export default function Login() {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Add useNavigate hook

  const validate = () => {
    // Implement your validation logic here
    // If valid, proceed with login, otherwise set isError to true
    setIsError(false); // For demonstration, assuming validation passes
    navigate('/'); // Navigate to home or desired route on successful login
  }

  return (
    <Container maxWidth="xs" component={Paper} sx={{ p: 3 }}>
      <Box sx={{ p: 1 }}>
        <Typography variant="h5" sx={{ p: 1 }}>Demo Project</Typography>
        <TextField
          error={isError}
          helperText={isError ? "Invalid Email" : ""}
          fullWidth
          label="Email"
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <TextField
          error={isError}
          helperText={isError ? "Invalid Password" : ""}
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <Button size="large" fullWidth onClick={validate} variant="contained" endIcon={<LoginTwoToneIcon />}>
          Login
        </Button>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography align="center">or</Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <Button
          component={Link} // Wrap the button with Link
          to="/Signup"
          size="large"
          fullWidth
          variant="contained"
          endIcon={<PersonAddAltRoundedIcon />}
        >
          Sign up
        </Button>
      </Box>
    </Container>
  );
}
