import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Employees from './employees';
import AddEmployee from './addemployees';


const App = () => {
  return (
    <Router>
    <div className="flex">
      <div className="w-1/4 bg-gray-200">
        <nav>
          <ul>
            <li>
              <Link to="/">Employees</Link>
            </li>
            <li>
              <Link to="/addemployee">Add Employee</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-3/4">
        <Routes>
          <Route path="/" element={<Employees />} />
          <Route path="/addemployee" element={<AddEmployee />} />
        </Routes>
      </div>
    </div>
  </Router>

  );
};

export default App;
