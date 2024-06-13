// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Main from './Pages/Main';
import Supplietrs from './Pages/Suppliers';
import Supplies from './Pages/Supplies';
import PatientMedication from './Pages/PatientMedication';
import StaffAllocation from './Pages/StaffAllocation';
import Settings from './Pages/Settings';
import Staff from './MainPages/Staff';
import Patient from './MainPages/Patient';
import PatientAllocation from './MainPages/PatientAllocation';
import Appointment from './MainPages/Appointment';
import Ward from './MainPages/Ward';
import WardRequisition from './MainPages/WardRequisition';
import Suppliers from './Pages/Suppliers';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index:true,
        element: <Main />
       
      },
      {
        path:"main",
        element:<Main/>,
        children: [
        {
          path: "staff",
          element: <Staff />
        },
        {
          path: "patient",
          element: <Patient />
        },
        {
          path: "patientAllocation",
          element: <PatientAllocation />
        },
        {
          path: "appointment",
          element: <Appointment />
        },
        {
          path: "ward",
          element: <Ward />
        },
        {
          path: "wardrequisition",
          element: <WardRequisition />
        }
      ]
    },
      {
        path: "suppliers",
        element: <Suppliers />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "StaffAllocation",
        element: <StaffAllocation />
      },
      {
        path: "supplies",
        element: <Supplies />
      },
      {
        path: "patientMedication",
        element: <PatientMedication />
      },
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
