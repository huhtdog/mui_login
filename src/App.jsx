// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Main from './Pages/Main';


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
          path: "users",
          element: <div>Users</div>
      },
      {
          path: "reports",
          element: <div>Reports</div>
      },
      {
          path: "settings",
          element: <div>Settings</div>
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
