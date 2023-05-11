const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newgen'
});

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/api/addemployees', (req, res) => {
  
  // รับ req มาจาก post man ตาม format body json 
  const employees = req.body;
  // ดึงข้อมูลที่เป็น emp_id เกบไว้ใน empids
  const empIds = employees.map(employee => employee.emp_id);
  pool.query('SELECT emp_id FROM employees WHERE emp_id IN (?)', [empIds], (error, results) => {
    if (error) {
      res.status(500).send('Error checking employee records: ' + error.message);
    } else if (results.length > 0) {
      const existingEmpIds = results.map(result => result.emp_id);
      res.status(400).send('Employee records already exist with emp_ids: ' + existingEmpIds.join(', '));
    } else {
      const genderMap = {
        'Male': 1,
        'Female': 2,
        'Other': 3
      };
      const departmentMap = {
        'Sales': 1,
        'IT Support': 2,
        'Programmer': 3,
        'SA': 4,
        'Customer': 5,
        'Other' : 6
      };
  
      employees.forEach(employee => {
        employee.gender_id = genderMap[employee.gender_id];
        employee.department_id = departmentMap[employee.department_id];
      });
      
      const values = employees.map(employee => [employee.emp_id, employee.name, employee.age, employee.gender_id, employee.email, employee.department_id, employee.salary]);
      pool.query('INSERT INTO employees (emp_id, name, age, gender_id, email, department_id, salary) VALUES ?', [values], (error, results) => {
        if (error) {
          res.status(500).send('Error adding employee records: ' + error.message);
        } else {
          res.send('Employee records added successfully');
        }
      });
    }
  });
});

app.get('/api/employees', (req, res) => {
  const query = `
    SELECT emp.emp_id, emp.name, emp.age, emp.email, gn.name AS gender, dp.name AS department
    FROM employees emp
    INNER JOIN gender gn ON gn.id = emp.gender_id
    INNER JOIN departments dp ON dp.id = emp.department_id
  `;

  pool.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error retrieving employee records: ' + error.message);
    } else {
      res.json(results);
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});