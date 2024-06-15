import { Paper } from "@mui/material"
export default function StaffAllocation() {
    // Retrieve the authentication token from localStorage
const authTokenString = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');

// Parse the JSON string into an object
const authToken = JSON.parse(authTokenString);

// Extract the email property from the authToken object
const userEmail = authToken.user.email;

// Log the email to the console bisan@unsa.com
console.log('User email:', userEmail);

   // Retrieve the authentication token from localStorage
   const authTokenString2 = localStorage.getItem('sb-yavdfdgkadqwybjcpjyo-auth-token');

   // Parse the JSON string into an object
   const authToken2 = JSON.parse(authTokenString);
   
   // Extract the email property from the authToken object
   const userEmail2 = authToken.user.email;
   
   // Log the email to the console bisan@unsa.com
   console.log('User email:', userEmail2);

  return (
    <Paper sx={{p:50}}>shessasdasd  hehehehe4h</Paper>
  )     
}
