import React, { useState, useEffect } from 'react';
import axios from "../../utils/apiticket";
import { Container, TextField, Button, Grid, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TicketForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [entries, setEntries] = useState([{ ticketNo: '', noOfHours: '', description: '' }]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [ticketNumbers, setTicketNumbers] = useState(new Set()); // To track unique ticket numbers

  // Fetch employee IDs from API
  useEffect(() => {
    const fetchEmployeeIds = async () => {
      try {
        const response = await axios.get('/employee-ids');
        console.log('API response:', response); // Log the entire response object
        console.log('API response data:', response.data); // Log the data specifically

        // Access employee IDs from response.data.data
        if (Array.isArray(response.data.data)) {
          const ids = response.data.data.map((item) => item.employeeId);
          setEmployeeIds(ids); // Store the employeeId values in the state
        } else {
          console.error('Response data.data is not an array:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching employee IDs:', error);
      }
    };

    fetchEmployeeIds();
  }, []);

  const handleInputChange = (index, e) => {
    const values = [...entries];
    values[index][e.target.name] = e.target.value;

    if (e.target.name === 'ticketNo') {
      // Check if ticket number is unique
      const newTicketNumbers = new Set(ticketNumbers);
      if (newTicketNumbers.has(e.target.value)) {
        alert('Ticket number must be unique!');
        return; // Prevent the change if ticket number is not unique
      }
      newTicketNumbers.add(e.target.value);
      setTicketNumbers(newTicketNumbers);
    }

    setEntries(values);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { ticketNo: '', noOfHours: '', description: '' }]);
  };

  const handleDeleteEntry = (index) => {
    const values = [...entries];
    const deletedTicketNo = values[index].ticketNo;
    values.splice(index, 1);
    
    // Remove the deleted ticket number from the set
    const newTicketNumbers = new Set(ticketNumbers);
    newTicketNumbers.delete(deletedTicketNo);
    setTicketNumbers(newTicketNumbers);

    setEntries(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all ticket numbers are unique before submission
    const ticketNos = entries.map(entry => entry.ticketNo);
    const uniqueTicketNos = new Set(ticketNos);
    if (ticketNos.length !== uniqueTicketNos.size) {
      alert('Ticket numbers must be unique!');
      return;
    }

    const data = {
      employeeId,
      date,
      entries,
    };

    try {
      await axios.post('/ticketsdata', data);
      alert('Data submitted successfully!');
      
      // Reset form fields after successful submission
      setEmployeeId('');
      setDate('');
      setEntries([{ ticketNo: '', noOfHours: '', description: '' }]);
      setTicketNumbers(new Set());
    } catch (error) {
      alert('Error submitting data!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Submit Tickets Data
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel>Employee ID</InputLabel>
              <Select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                label="Employee ID"
                required
              >
                {employeeIds.length > 0 ? (
                  employeeIds.map((id, index) => (
                    <MenuItem key={index} value={id}>
                      {id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No Employee IDs Available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          <Box mb={3}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          {entries.map((entry, index) => (
            <Box key={index} mb={3}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={11}>
                  <Typography variant="h6">
                    Entry {index + 1}
                  </Typography>
                </Grid>
                {/* Only show delete icon for entries after the first one */}
                {index > 0 && (
                  <Grid item xs={1} textAlign="right">
                    <IconButton
                      color="black"
                      onClick={() => handleDeleteEntry(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ticket Number"
                    fullWidth
                    variant="outlined"
                    name="ticketNo"
                    value={entry.ticketNo}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Number of Hours"
                    type="number"
                    fullWidth
                    variant="outlined"
                    name="noOfHours"
                    value={entry.noOfHours}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box mt={2}>
                    <TextField
                      label="Description"
                      fullWidth
                      variant="outlined"
                      name="description"
                      value={entry.description}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      multiline
                      rows={4}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box mb={3}>
            <Button variant="contained" color="primary" onClick={handleAddEntry}>
              Add Another Entry
            </Button>
          </Box>

          <Box mb={3}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default TicketForm;
