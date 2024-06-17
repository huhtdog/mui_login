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
    <Container maxWidth="100px" sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundImage: 'url("/1.jpg.jpg")', // Add your image path here
      backgroundSize: "cover", 
      backgroundPosition: "center",
      bgcolor: "#FFFDD0" 
    }}>
      <Card sx={{ width: "100%", maxWidth: 400, boxShadow: 3 }}>
        <CardContent sx={{ p: 4, backgroundColor: "#fff", color: "#000" }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C576EE" }}>Wellmeadows Hospital</Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "#000" }}>Please enter your details to continue</Typography>
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
              label="Username"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: '#000' },
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#007bff' },
                  '&.Mui-focused fieldset': { borderColor: '#007bff' },
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#000' }}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { color: '#000' }
              }}
              sx={{
                '& .MuiInputBase-input': { color: '#000' },
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#007bff' },
                  '&.Mui-focused fieldset': { borderColor: '#007bff' },
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
              sx={{ py: 1, backgroundColor: '#007bff', color: '#fff', '&:hover': { backgroundColor: '#00b0ff' } }}
            >
              Sign in
            </Button>
          </Box>
          <Box sx={{ textAlign: "center", my: 2 }}>
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
                color: '#000',
                borderColor: '#ccc',
                '&:hover': {
                  backgroundColor: 'rgba(0, 128, 0, 0.1)',
                  borderColor: '#007bff'
                }
              }}
            >
              Create Account
            </Button>
          </Box>
          <Box sx={{ textAlign: "center", mt: 2 }}>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}