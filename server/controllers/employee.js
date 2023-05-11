const express = require('express');
const router = express.Router();
const employeeModel = require('../models/employee');

router.get('/', (req, res) => {
  employeeModel.getAllEmployees((error, results) => {
    if (error) {
      res.status(500).send('Error retrieving employee records: ' + error.message);
    } else {
      res.render('employees', { employees: results });
    }
  });
});

module.exports = router;
