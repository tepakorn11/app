const mysql = require('mysql');

// สร้างการเชื่อมต่อกับฐานข้อมูล
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newgen'
});

// ฟังก์ชันสำหรับการดึงข้อมูลพนักงานทั้งหมด
function getAllEmployees(callback) {
  pool.query('SELECT * FROM employees', (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

module.exports = {
  getAllEmployees
};
