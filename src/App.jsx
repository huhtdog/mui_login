import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Main from './Pages/Main';
import Suppliers from './Pages/Suppliers';
import Supplies from './Pages/Supplies';
import PatientMedication from './Pages/PatientMedication';
import StaffAllocation from './Pages/StaffAllocation';
import Qualification from './Pages/Qualification';
import Staff from './MainPages/Staff';
import Patient from './MainPages/Patient';
import Appointment from './MainPages/Appointment';
import Ward from './MainPages/Ward';
import WardRequisition from './MainPages/WardRequisition';
import PharmaceuticalSupplies from './Pages/pharmaceuticalsupplies';
import WorkExperience from './Pages/WorkExperience';
import EmploymentContract from './Pages/EmploymentContract';
import BookAppointments from './MainPages/BookAppointments';
import Allpatient from './Patients/Allpatient';
import Inpatient from './Patients/Inpatient';
import Outpatient from './Patients/Outpatient';
import Waitinglist from './Patients/Waitinglist';
import Localdoctors from './MainPages/localdoctor';


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
        index: true,
        element: <Main />
      },
      {
        path: "main",
        element: <Main />,
        children: [
          {
            path: "staff",
            element: <Staff />
          },
          {
            path: "patient",
            element: <Patient />,
            children: [
              {
                path: 'outpatient',
                element: <Outpatient/>
              },
              {
                path: 'allpatient',
                element: <Allpatient/>
              },
              {
                path: 'inpatient',
                element: <Inpatient/>
              },{
                path: 'waitinglist',
                element: <Waitinglist/>
              }
            ]
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
          },
          {
            path: "bookappointments",
            element: <BookAppointments />
          }
        ]
      },
      {
        path: "suppliers",
        element: <Suppliers />
      },
      {
        path: "qualification",
        element: <Qualification />
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
      {
        path: "pharmaceuticalSupplies",
        element: <PharmaceuticalSupplies />
      },
      {
        path: "workExperience",
        element: <WorkExperience />
      },
      {
        path: "employmentContract",
        element: <EmploymentContract />
      },
      {
        path: "localdoctors",
        element: <Localdoctors />
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
