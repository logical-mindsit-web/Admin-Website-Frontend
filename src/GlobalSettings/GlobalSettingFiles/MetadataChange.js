import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Container
} from '@mui/material';
import axios from "../../utils/api"; 

const UpdateUserSettings = () => {
  const [manualMapping, setManualMapping] = useState('');
  const [objectDisinfection, setObjectDisinfection] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/settings/updateAll', {
        manualMapping,
        objectDisinfection
      });

      setSuccessMessage(response.data.message);
      setManualMapping('');
      setObjectDisinfection('');
    } catch (error) {
      console.error('Error updating user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Update Metadata For AllUser 
      </Typography>
      <Box component="form">
        <FormControl fullWidth margin="normal">
          <InputLabel>Manual Mapping</InputLabel>
          <Select
            value={manualMapping}
            onChange={(e) => setManualMapping(e.target.value)}
          >
            <MenuItem value="enabled">Enabled</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Object Disinfection</InputLabel>
          <Select
            value={objectDisinfection}
            onChange={(e) => setObjectDisinfection(e.target.value)}
          >
            <MenuItem value="enabled">Enabled</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>

        {loading && <CircularProgress />}
        {successMessage && <Typography color="success.main">{successMessage}</Typography>}

        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateUserSettings;
