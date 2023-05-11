import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';  
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);
  useEffect(() => {
    deleteSelectedEmployees();
  }, [selectedRows]); 
  
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows.selectedRows);
  };

  const handleDeleteEmployee = async (emp_id) => {
    try {
      await axios.delete(`http://localhost:3000/api/deleteemployees/${emp_id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    }
  };

  const deleteSelectedEmployees = async () => {
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await handleDeleteEmployee(row.emp_id);
        })
      );
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting employees:', error.message);
    }
  };

  const renderEmployees = () => {
    const columns = [
      { name: '#', selector: (row) => row.emp_id, sortable: true },
      { name: 'First', selector: (row) => row.name, sortable: true },
      { name: 'Age', selector: (row) => row.age, sortable: true },
      { name: 'Gender', selector: (row) => row.gender, sortable: true },
      { name: 'Department', selector: (row) => row.department, sortable: true },
      {
        name: 'Action',
        cell: (row) => (
          <div className="flex justify-center">
            <Link to={`/editemployee/${row.emp_id}`} className="mr-2">
              <FaEdit />
            </Link>
            <button
              onClick={() => handleDeleteEmployee(row.emp_id)}
              className="text-red-600"
              >
              <FaTrash />
              </button>
              </div>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              button: true,
              },
              ];
              const tableCustomStyles = {
                headRow: {
                  style: {
                    backgroundColor: 'blue',
                    fontWeight: 'bold',
                    color: 'white',
                  },
                },
                headCells: {
                  style: {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                  },
                },
              };
              
              const renderDeleteButton = () => {
                if (selectedRows.length > 0) {
                  return (
                    <button
                      onClick={deleteSelectedEmployees}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                      Delete Selected
                    </button>
                  );
                }
                return null;
              };
              
              return (
                <div>
                  <div className="bg-gray-800 p-4">
                    <h1 className="text-white text-2xl font-semibold">Employee Management</h1>
                  </div>
                  <div className="container mx-auto mt-4">
                    <div className="flex justify-between mb-4 ml-4">
                      <Link to="/addemployee">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Add Employee
                        </button>
                      </Link>
                      {renderDeleteButton()}
                    </div>
                    <DataTable
                      columns={columns}
                      data={employees}
                      customStyles={tableCustomStyles}
                      selectableRows
                      selectableRowsHighlight
                      onSelectedRowsChange={handleSelectedRowsChange}
                      selectableRowSelected={(row) => selectedRows.includes(row.emp_id)}
                    />
                  </div>
                </div>
              );
            };

            return (
            <>
            {employees.length > 0 ? (
            renderEmployees()
            ) : (
            <p>Loading employees...</p>
            )}
            </>
            );
            };
            
            export default Employees;
