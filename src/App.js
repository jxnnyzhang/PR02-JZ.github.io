import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Snackbar, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import TaskDialog from './TaskDialog'; // Make sure to import TaskDialog
import './App.css';

const theme = createTheme({
  shape: {
    borderRadius: 0, // this will set border-radius to 0 for all Material-UI components
  },
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '' });

  // Task fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState('');
  const [isComplete, setIsComplete] = useState(false);

 // Function to handle adding or updating a task
 const handleAddOrUpdateTask = (taskData) => {
  if (validateForm(taskData)) { // Now passing taskData to validateForm
    if (taskToEdit) {
      // Handle the update logic
      const updatedTasks = tasks.map(t => 
        t.id === taskToEdit.id ? { ...t, ...taskData } : t
      );
      setTasks(updatedTasks);
      setSuccessToastOpen(true);
      setTaskToEdit(null); // Reset taskToEdit after update
    } else {
      // Handle the add logic
      const newTask = { ...taskData, id: Date.now() };
      setTasks([...tasks, newTask]);
      setSuccessToastOpen(true);
    }
    setDialogOpen(false); // Close the dialog for both add and update
  }
};

// Function to validate form entries now takes taskData as argument
const validateForm = (taskData) => {
  let tempErrors = {};
  let isValid = true;
  if (!taskData.title) {
    tempErrors.title = 'Title is Required!';
    isValid = false;
  } else if (tasks.some(task => task.title === taskData.title && task.id !== taskToEdit?.id)) {
    tempErrors.title = 'Title must be unique!';
    isValid = false;
  }
  if (!taskData.description) {
    tempErrors.description = 'Description is Required!';
    isValid = false;
  }
  // Continue validation for other fields...
  
  setErrors(tempErrors);
  return isValid;
};

  // Function to handle deleting a task
  const handleDeleteTask = (taskToDelete) => {
    // Filter out the task to delete from the tasks array
    const updatedTasks = tasks.filter((task) => task !== taskToDelete);
    setTasks(updatedTasks);

    // Close the dialog if the deleted task was being edited
    if (taskToDelete === taskToEdit) {
      setDialogOpen(false);
      setTaskToEdit(null);
    }

    // Show success toaster
    setSuccessToastOpen(true);
  };

  const handleCloseDialog = () => {
    // Close the dialog and reset taskToEdit
    setDialogOpen(false);
    setTaskToEdit(null);

    // Reset form fields
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('');
    setIsComplete(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{  width: '100%', margin: 'auto', overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table aria-label="custom styled table" sx={{ width: '100%' }}>
            <TableHead>
              <TableRow className="table-header">
                <TableCell colSpan={7} style={{ padding: 0 }}>
                  <div className="header-content">
                    <span className="header-title">FRAMEWORKS</span>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      className="add-button"
                      startIcon={<AddCircleIcon />}
                      onClick={() => {
                        setTaskToEdit(null); // Reset taskToEdit
                        setTitle('');
                        setDescription('');
                        setDeadline('');
                        setPriority('');
                        setIsComplete(false);
                        setDialogOpen(true);
                      }}
                    >
                      ADD
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="table-subheader">
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Is Complete</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.isComplete ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        // Set task fields for editing
                        setTaskToEdit(task);
                        setTitle(task.title);
                        setDescription(task.description);
                        setDeadline(task.deadline);
                        setPriority(task.priority);
                        setIsComplete(task.isComplete);
                        setDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTask(task)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TaskDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        task={taskToEdit}
        onSave={handleAddOrUpdateTask}
        onDelete={handleDeleteTask}
        validateForm={validateForm} // Pass validateForm to TaskDialog
        errors={errors} // Pass form errors to TaskDialog
      />
      {/* Success toaster */}
      <Snackbar
        open={successToastOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessToastOpen(false)}
        message={taskToEdit ? "Task updated successfully" : "Task added successfully"}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </ThemeProvider>
  );
}

export default App;
