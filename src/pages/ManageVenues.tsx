import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Skeleton,
  Stack,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { venueService } from '../services/venue.service';
import { Venue, MediaObject } from '../types/api.types';

interface VenueFormData {
  name: string;
  description: string;
  media: string[];
  price: number;
  maxGuests: number;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
  };
}

const initialFormData: VenueFormData = {
  name: '',
  description: '',
  media: [''],
  price: 0,
  maxGuests: 1,
  meta: {
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false
  },
  location: {
    address: '',
    city: '',
    zip: '',
    country: '',
    continent: ''
  }
};

const ManageVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<VenueFormData>(initialFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await venueService.getManagerVenues();
      setVenues(data);
    } catch (err) {
      setError('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (venue?: Venue) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name,
        description: venue.description,
        media: venue.media.map(m => typeof m === 'string' ? m : m.url),
        price: venue.price,
        maxGuests: venue.maxGuests,
        meta: { ...venue.meta },
        location: { ...venue.location }
      });
    } else {
      setEditingVenue(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVenue(null);
    setFormData(initialFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    
    if (name.startsWith('meta.')) {
      const metaKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        meta: { ...prev.meta, [metaKey]: checked }
      }));
    } else if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationKey]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleMediaChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((url, i) => i === index ? value : url)
    }));
  };

  const addMediaField = () => {
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, '']
    }));
  };

  const removeMediaField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const venueData = {
        ...formData,
        media: formData.media.filter(url => url.trim() !== '').map(url => ({
          url,
          alt: 'Venue image'
        }))
      };

      if (editingVenue) {
        await venueService.updateVenue(editingVenue.id, venueData);
        setSuccess('Venue updated successfully');
      } else {
        await venueService.createVenue(venueData);
        setSuccess('Venue created successfully');
      }

      handleCloseDialog();
      fetchVenues();
    } catch (err: any) {
      setError(err.message || 'Failed to save venue');
    }
  };

  const handleDelete = async (venue: Venue) => {
    setVenueToDelete(venue);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!venueToDelete) return;

    try {
      await venueService.deleteVenue(venueToDelete.id);
      setSuccess('Venue deleted successfully');
      fetchVenues();
    } catch (err) {
      setError('Failed to delete venue');
    } finally {
      setDeleteConfirmOpen(false);
      setVenueToDelete(null);
    }
  };

  const getDefaultImage = (): MediaObject => ({
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    alt: 'Default venue image'
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={500} height={30} />
        </Box>
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ pt: 2 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Manage Venues
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create and manage your venue listings
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            height: 'fit-content',
            textTransform: 'none'
          }}
        >
          Add New Venue
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}

      {venues.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't created any venues yet
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Create Your First Venue
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {venues.map((venue) => (
            <Grid item xs={12} sm={6} md={4} key={venue.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={venue.media?.[0]?.url || getDefaultImage().url}
                  alt={venue.media?.[0]?.alt || venue.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {venue.name}
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocationOnIcon color="action" sx={{ fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {venue.location.city}, {venue.location.country}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {venue.description.length > 100 
                      ? `${venue.description.substring(0, 100)}...` 
                      : venue.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={`€${venue.price}/night`}
                      color="primary"
                      size="small"
                    />
                    <Chip 
                      label={`${venue.maxGuests} guests`}
                      size="small"
                    />
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(venue)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(venue)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Venue Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingVenue ? 'Edit Venue' : 'Create New Venue'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Venue Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Media URLs
              </Typography>
              {formData.media.map((url, index) => (
                <Stack direction="row" spacing={2} sx={{ mb: 2 }} key={index}>
                  <TextField
                    label={`Image URL ${index + 1}`}
                    value={url}
                    onChange={(e) => handleMediaChange(index, e.target.value)}
                    fullWidth
                  />
                  <Button 
                    color="error" 
                    onClick={() => removeMediaField(index)}
                    disabled={index === 0}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
              <Button onClick={addMediaField}>
                Add Image URL
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price per Night"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Maximum Guests"
                  name="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Amenities
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.meta.wifi}
                        onChange={handleChange}
                        name="meta.wifi"
                      />
                    }
                    label="WiFi"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.meta.parking}
                        onChange={handleChange}
                        name="meta.parking"
                      />
                    }
                    label="Parking"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.meta.breakfast}
                        onChange={handleChange}
                        name="meta.breakfast"
                      />
                    }
                    label="Breakfast"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.meta.pets}
                        onChange={handleChange}
                        name="meta.pets"
                      />
                    }
                    label="Pets Allowed"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Location
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ZIP Code"
                    name="location.zip"
                    value={formData.location.zip}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Continent"
                    name="location.continent"
                    value={formData.location.continent}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVenue ? 'Update Venue' : 'Create Venue'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{venueToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageVenues;