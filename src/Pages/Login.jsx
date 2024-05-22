import { Container, Box, Paper, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { useState } from 'react'; // Correct import statement for useState
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons here
import '../Styles/Login.css';

export default function Login() {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    // Implement your validation logic here
    // For example, check if the email and password are valid
    // If valid, proceed with login, otherwise set isError to true
    setIsError(true); // For demonstration, setting error to true always
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
      <Button size="large" fullWidth variant="contained" endIcon={<PersonAddAltRoundedIcon />}>
  Sign up
</Button>
      </Box>
    </Container>
  );
}
