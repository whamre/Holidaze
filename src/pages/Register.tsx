import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Link,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
    agreeToTerms: false
  });

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    // Name format validation (only letters, numbers, and underscores)
    if (!formData.name.match(/^[\w]+$/)) {
      setError('Name can only contain letters, numbers, and underscores');
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.email.endsWith('@stud.noroff.no')) {
      setError('Only @stud.noroff.no email addresses are allowed');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'venueManager' || name === 'agreeToTerms' ? checked : value
    }));
    // Clear error when user starts typing
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { agreeToTerms, ...registerData } = formData;
      await authService.register({
        ...registerData,
        name: registerData.name.trim()
      });
      
      // After successful registration, attempt to login
      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      login(loginResponse);
      navigate('/');
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Create Account
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 4 }}
          >
            Join Holidaze to start booking amazing venues
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Username"
              name="name"
              autoComplete="username"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              helperText="Only letters, numbers, and underscores allowed"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              helperText="Must be a @stud.noroff.no email address"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              helperText="Must be at least 8 characters long"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="venueManager"
                  checked={formData.venueManager}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Register as a Venue Manager"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  color="primary"
                  required
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{ 
                mb: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Create Account
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                color="primary"
                sx={{ 
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;