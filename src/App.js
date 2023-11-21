  import React, { useState, useEffect } from 'react';
  import { createTheme, ThemeProvider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Snackbar, IconButton, Tooltip } from '@mui/material';
  import AddCircleIcon from '@mui/icons-material/AddCircle';
  import EditIcon from '@mui/icons-material/EditNote'; // Assuming EditNote is the pencil on notepad icon
  import CancelIcon from '@mui/icons-material/Cancel';
  import BlockIcon from '@mui/icons-material/Block';
  import MenuIcon from '@mui/icons-material/Menu';
  import Checkbox from '@mui/material/Checkbox';
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
    // Task fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [priority, setPriority] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Combine add and update task logic
    const handleAddOrUpdateTask = (taskData) => {
      if (taskToEdit) {
        // Update task logic
        setTasks(tasks.map(task => task.id === taskToEdit.id ? { ...task, ...taskData } : task));
        setSuccessToastOpen(true);
        setTaskToEdit(null);
      } else {
        // Add task logic
        setTasks([...tasks, { ...taskData, id: Date.now() }]);
        setSuccessToastOpen(true);
      }
      setDialogOpen(false);
    };
  
    // Delete task logic
    const handleDeleteTask = (taskToDelete) => {
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      if (taskToDelete === taskToEdit) {
        setDialogOpen(false);
        setTaskToEdit(null);
      }
      setSuccessToastOpen(true);
    };
  
    const handleCloseDialog = () => {
      setDialogOpen(false);
      setTaskToEdit(null);
    };
    
    const handleCompletionChange = (task, event) => {
      // Update the task's isComplete status
      setTasks(tasks.map(t => t.id === task.id ? { ...t, isComplete: event.target.checked } : t));
    };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{  width: '100%', margin: 'auto', overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table aria-label="custom styled table" sx={{ width: '100%' }}>
            <TableHead>
              <TableRow className="table-header">
                <TableCell colSpan={7} style={{ padding: 0 }}>
                  <div className="header-content" style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton className="menu-icon">
                    <MenuIcon />
                  </IconButton>
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
                  <TableCell align="center" style={{ verticalAlign: 'middle' }}>{task.title}</TableCell>
                  <TableCell align="center" style={{ verticalAlign: 'middle' }}>{task.description}</TableCell>
                  <TableCell align="center" style={{ verticalAlign: 'middle' }}>{task.deadline.toDateString()}</TableCell>
                  <TableCell align="center" style={{ verticalAlign: 'middle' }}>{task.priority}</TableCell>
                  <TableCell align="center" style={{ verticalAlign: 'middle' }}>
                  <Checkbox
                  checked={task.isComplete}
                  onChange={(event) => handleCompletionChange(task, event)}
                />
                </TableCell>
                  <TableCell align="center" style={{ verticalAlign: 'middle' }}>
                  {!task.isComplete && (
                     <Tooltip title="Update" placement="top">
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
                    </Tooltip>
                    )}
                    <Tooltip title="Delete" placement="bottom">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteTask(task)}
                      >
                        <CancelIcon />
                      </IconButton>
                      </Tooltip>
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
      />
      {/* Success toaster */}
      <Snackbar
        open={successToastOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessToastOpen(false)}
        message={taskToEdit ? "Task updated successfully" : "Task added successfully" }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </ThemeProvider>
  );
}

export default App;
