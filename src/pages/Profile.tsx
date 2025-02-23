import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Button, 
  Grid, 
  TextField, 
  Switch, 
  FormControlLabel,
  Alert,
  Stack,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';

const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    avatar: user?.avatar?.url || '',
    venueManager: user?.venueManager || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'venueManager' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update avatar if changed
      if (formData.avatar !== user?.avatar?.url) {
        await authService.updateAvatar(formData.avatar);
      }

      // Update venue manager status if changed
      if (formData.venueManager !== user?.venueManager) {
        await authService.updateProfile({
          venueManager: formData.venueManager
        });
      }

      // Get updated user data
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        updateUser(updatedUser);
      }

      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Profile Overview */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={user.avatar?.url}
                      alt={user.name}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto',
                        border: `4px solid ${theme.palette.background.paper}`,
                        boxShadow: theme.shadows[3],
                        bgcolor: theme.palette.primary.main,
                        fontSize: '3rem'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {editMode && (
                      <Tooltip title="Change Avatar">
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            boxShadow: theme.shadows[2],
                            '&:hover': {
                              bgcolor: 'background.paper'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mt: 2, 
                      fontWeight: 'bold',
                      color: 'text.primary'
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Member since {new Date().getFullYear()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1">
                        {user.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BusinessCenterIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Type
                      </Typography>
                      <Typography variant="body1">
                        {user.venueManager ? 'Venue Manager' : 'Customer'}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Edit Profile */}
          <Grid item xs={12} md={8}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 4
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Profile Settings
                  </Typography>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(!editMode)}
                    color={editMode ? 'error' : 'primary'}
                    variant={editMode ? 'outlined' : 'contained'}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>

                {editMode ? (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          Avatar URL
                        </Typography>
                        <TextField
                          fullWidth
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleChange}
                          placeholder="Enter image URL"
                          helperText="Enter a valid image URL for your avatar"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              bgcolor: alpha(theme.palette.primary.main, 0.02)
                            }
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          Account Type
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{ 
                            p: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                            borderRadius: 2
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.venueManager}
                                onChange={handleChange}
                                name="venueManager"
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  Venue Manager
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Enable this to list and manage your own venues
                                </Typography>
                              </Box>
                            }
                          />
                        </Paper>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          startIcon={<SaveIcon />}
                          sx={{ flex: 1 }}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              avatar: user.avatar?.url || '',
                              venueManager: user.venueManager
                            });
                          }}
                          disabled={loading}
                          startIcon={<CloseIcon />}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Stack>
                  </form>
                ) : (
                  <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Click the "Edit Profile" button to modify your profile settings.
                    </Typography>
                  </Box>
                )}

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mt: 3 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ mt: 3 }}
                    onClose={() => setSuccess('')}
                  >
                    {success}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;