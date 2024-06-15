import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicationIcon from '@mui/icons-material/Medication';
import SchoolIcon from '@mui/icons-material/School';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionIcon from '@mui/icons-material/Description'; // Import the new icon for employment contract
import { Link } from 'react-router-dom';

const styles = { textDecoration: "none", color: "inherit" };

export const mainListItems = (
    <React.Fragment>
        <Link to="/dashboard" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/staffAllocation" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Staff Allocation" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/patientMedication" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary="Patient Medication" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/supplies" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <LocalHospitalIcon />
                </ListItemIcon>
                <ListItemText primary="Supplies" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/suppliers" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Suppliers" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/pharmaceuticalSupplies" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <MedicationIcon />
                </ListItemIcon>
                <ListItemText primary="Pharmaceutical Supplies" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/qualification" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Qualification" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/workExperience" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <WorkOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Work Experience" />
            </ListItemButton>
        </Link> 
        <Link to="/dashboard/employmentContract" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DescriptionIcon /> {/* Use the new icon here */}
                </ListItemIcon>
                <ListItemText primary="Employment Contract" />
            </ListItemButton>
        </Link> 
    </React.Fragment>
);
