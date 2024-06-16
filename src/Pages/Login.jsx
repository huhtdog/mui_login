// Login.js
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Paper, TextField, Button, Typography, IconButton, InputAdornment, Alert } from "@mui/material";
import { useState } from 'react';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import supabase from '../Services/Supabase';

export default function Login() {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Something went wrong");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      setIsError(true);
      setErrorMessage(error.message);
      return;
    }

    if (data) {
      navigate("/dashboard");
    }
  }

  return (
    <Container 
      maxWidth="xs" 
      component={Paper} 
      sx={{ 
        p: 3, 
        mt: 5, 
        borderRadius: 2, 
        boxShadow: 3, 
        backgroundColor: 'black', 
        color: 'white' 
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'green' }}>Wellmeadows Hospital</Typography>
      </Box>
      {isError && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{errorMessage}</Alert>
        </Box>
      )}
      <Box sx={{ mb: 2 }}>
        <TextField
          error={isError}
          helperText={isError ? "Invalid Email or Password" : ""}
          fullWidth
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
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
      <Box sx={{ mb: 2 }}>
        <TextField
          error={isError}
          helperText={isError ? "Invalid Email or Password" : ""}
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'white' }}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { color: 'white' }
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
      <Box sx={{ mb: 2 }}>
        <Button
          size="large"
          onClick={login}
          fullWidth
          variant="contained"
          endIcon={<LoginTwoToneIcon />}
          sx={{ py: 1, backgroundColor: 'green', color: 'black', '&:hover': { backgroundColor: 'darkgreen' } }}
        >
          Login
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Typography variant="body1">or</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button
          component={Link}
          to="/Signup"
          size="large"
          fullWidth
          variant="outlined"
          endIcon={<PersonAddAltRoundedIcon />}
          sx={{ 
            py: 1, 
            color: 'green', 
            borderColor: 'green', 
            '&:hover': { 
              backgroundColor: 'rgba(0, 128, 0, 0.1)', 
              borderColor: 'darkgreen' 
            } 
          }}
        >
          Sign up
        </Button>
      </Box>
    </Container>
  );
}
