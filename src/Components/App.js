// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Doctors from './Doctors';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/doctors" component={Doctors} />
                {/* Add other routes here */}
            </Switch>
        </Router>
    );
}

export default App;
