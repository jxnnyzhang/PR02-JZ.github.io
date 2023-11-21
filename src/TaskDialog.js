import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@date-io/date-fns';

const TaskDialog = ({ open, onClose, task, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Set initial values when the task prop changes
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDeadline(task.deadline);
      setPriority(task.priority);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline(new Date());
    setPriority('');
    setErrors({});
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!title) {
      tempErrors.title = 'Title is required!';
      isValid = false;
    }
    if (!description) {
      tempErrors.description = 'Description is required!';
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        title,
        description,
        deadline,
        priority,
        isComplete: task ? task.isComplete : false
      });
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        {!task && (
          <TextField
            error={!!errors.title}
            helperText={errors.title}
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="dense"
          />
        )}
        <TextField
          error={!!errors.description}
          helperText={errors.description}
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Deadline"
            value={deadline}
            onChange={setDeadline}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
        </LocalizationProvider>
        <RadioGroup
          row
          aria-label="priority"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ margin: 'dense' }}
        >
          <FormControlLabel value="low" control={<Radio />} label="Low" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="high" control={<Radio />} label="High" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        {task && (
          <Button onClick={() => onDelete(task)} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        )}
        <Button onClick={onClose} color="error" startIcon={<BlockIcon />}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" startIcon={task ? <EditIcon /> : <AddCircleIcon />}>
          {task ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
