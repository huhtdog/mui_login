import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, IconButton, InputAdornment, Alert, Card, CardContent } from "@mui/material";
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '##FFFDD0', // Black background color
        padding: '0 20px', // Optional: Add padding to the sides
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
        <CardContent sx={{ p: 4, backgroundColor: 'black', color: 'black' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'blue' }}>Wellmeadows Hospital</Typography>
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
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'blue' },
                  '&.Mui-focused fieldset': { borderColor: 'blue' },
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
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'blue' },
                  '&.Mui-focused fieldset': { borderColor: 'blue' },
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
              sx={{ py: 1, backgroundColor: 'blue', color: 'white', '&:hover': { backgroundColor: 'skyblue' } }}
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
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 128, 0, 0.1)',
                  borderColor: 'blue'
                }
              }}
            >
              Sign up
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
