const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors()); // เรียกใช้ CORS ก่อนส่วนที่ตั้งค่าเพิ่มเติม

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newgen'
});


// Routes
app.post('/api/addemployees', (req, res) => {

  const employees = req.body;
  const successfulAdds = [];

  const processEmployee = (employee) => {
    const { name, age, gender_id, email } = employee;

    pool.query('SELECT MAX(CAST(SUBSTRING(emp_id, 4) AS UNSIGNED)) AS max_emp_id FROM employees', (error, results) => {
      if (error) {
        res.status(500).send('Error retrieving the latest emp_id: ' + error.message);
      } else {
        const maxEmpId = results[0].max_emp_id || 0;
        const nextNumericPart = maxEmpId + 1;
        const paddedNumericPart = nextNumericPart.toString().padStart(3, '0');
        const newEmpId = 'EMP' + paddedNumericPart;

        pool.query('SELECT emp_id FROM employees WHERE emp_id = ?', [newEmpId], (error, results) => {
          if (error) {
            res.status(500).send('Error checking employee records: ' + error.message);
          } else if (results.length > 0) {
            res.status(400).send('Employee record already exists with emp_id: ' + newEmpId);
          } else {
            const genderMap = {
              'Male': 1,
              'Female': 2,
              'Other': 3
            };

            const genderId = genderMap[gender_id];

            const values = [[newEmpId, name, age, genderId, email]];
            pool.query('INSERT INTO employees (emp_id,name, age, gender_id, email) VALUES ?', [values], (error, results) => {
              if (error) {
                res.status(500).send('Error adding employee records: ' + error.message);
              } else {
                successfulAdds.push(employee);
                if (successfulAdds.length === employees.length) {
                  res.json({
                    message: 'Employees added successfully',
                    addedEmployees: successfulAdds
                  });
                  
                }
              }
            });
          }
        });
      }
    });
  };

  if (Array.isArray(employees)) {
    employees.forEach((employee) => {
      processEmployee(employee);
    });
  } else {
    processEmployee(employees);
  }
});

app.get('/api/employees', (req, res) => {
  const query = `SELECT emp.emp_id, emp.name, emp.age, emp.email, gn.name AS gender 
                            FROM employees emp INNER JOIN gender gn ON gn.id = emp.gender_id `;

  pool.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error retrieving employee records: ' + error.message);
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/deleteemployees/:emp_id', (req, res) => {
  const empId = req.params.emp_id; 

  pool.query('DELETE FROM employees WHERE emp_id = ?', [empId], (error, results) => {
    if (error) {
      res.status(500).send('Error deleting employee record: ' + error.message);
    } else if (results.affectedRows === 0) {
      res.status(404).send('Employee record not found');
    } else {
      res.send('Employee record deleted successfully');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

