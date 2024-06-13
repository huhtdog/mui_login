// Doctors.js
import React from 'react';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import DoctorList from './DoctorList';

function Doctors() {
    return (
        <Router>
            <div>
                <h2>Doctors</h2>
                <p>Here you can manage doctor information.</p>
                <Link to="/doctors/list">Go to Doctor List</Link>

                <Switch>
                    <Route path="/doctors/list" component={DoctorList} />
                </Switch>
            </div>
        </Router>
    );
}

export default Doctors;
