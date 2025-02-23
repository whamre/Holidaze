import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Chip,
  Button,
  Rating,
  Divider,
  Alert,
  Skeleton,
  Stack,
  useTheme,
  IconButton,
  Dialog,
  DialogContent,
  alpha,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PetsIcon from '@mui/icons-material/Pets';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CloseIcon from '@mui/icons-material/Close';
import { venueService } from '../services/venue.service';
import { bookingService } from '../services/booking.service';
import { useAuth } from '../contexts/AuthContext';
import { Venue, Booking, MediaObject } from '../types/api.types';
import BookingDialog from '../components/BookingDialog';
import { formatDateISO, isDateBooked } from '../utils/dateUtils';

const VenueDetails = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [openBooking, setOpenBooking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        if (!id) {
          setError('Venue ID is missing');
          setLoading(false);
          return;
        }
        
        const venueData = await venueService.getVenueById(id);
        if (!venueData) {
          setError('Venue not found');
          setLoading(false);
          return;
        }
        
        setVenue(venueData);
        const bookingsData = await bookingService.getVenueBookings(id);
        setBookings(bookingsData);
      } catch (err) {
        setError('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  const validateBookingDates = (start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    
    // Check if dates are in the past
    if (start < new Date()) return false;
    
    // Check if end date is after start date
    if (end <= start) return false;
    
    // Check if dates overlap with existing bookings
    return !bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return (
        (start >= bookingStart && start <= bookingEnd) ||
        (end >= bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      );
    });
  };

  const handleDateChange = (type: 'startDate' | 'endDate', date: Date | null) => {
    setSelectedDates(prev => {
      const newDates = { ...prev, [type]: date };
      if (newDates.startDate && newDates.endDate && !validateBookingDates(newDates.startDate, newDates.endDate)) {
        return prev;
      }
      return newDates;
    });
  };

  const getDefaultImage = (): MediaObject => ({
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    alt: 'Default venue image'
  });

  const mediaImages = venue?.media?.length ? venue.media : [getDefaultImage()];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mediaImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mediaImages.length) % mediaImages.length);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
            <Box sx={{ mt: 4 }}>
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={24} width="40%" sx={{ mt: 1 }} />
              <Skeleton variant="text" height={100} sx={{ mt: 2 }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !venue) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/venues')}>
              Back to Venues
            </Button>
          }
        >
          {error || 'Venue not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Main Image Gallery */}
            <Paper 
              elevation={0} 
              sx={{ 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiIconButton-root': {
                    opacity: 1
                  }
                }
              }}
              onClick={() => setOpenImageDialog(true)}
            >
              <Box
                component="img"
                src={mediaImages[currentImageIndex].url}
                alt={mediaImages[currentImageIndex].alt || venue.name}
                sx={{
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
              {mediaImages.length > 1 && (
                <>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'background.paper',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'background.paper',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  backdropFilter: 'blur(4px)'
                }}
              >
                <Typography variant="body2">
                  {currentImageIndex + 1} / {mediaImages.length}
                </Typography>
              </Box>
            </Paper>

            {/* Thumbnail Grid */}
            {mediaImages.length > 1 && (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {mediaImages.map((image, index) => (
                  <Grid item xs={2} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        cursor: 'pointer',
                        opacity: currentImageIndex === index ? 1 : 0.6,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt={`${venue.name} - ${index + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                  {venue.name}
                </Typography>
                <Rating value={venue.rating} precision={0.5} readOnly size="large" />
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <LocationOnIcon color="action" />
                <Typography variant="subtitle1" color="text.secondary">
                  {venue.location.address}, {venue.location.city}, {venue.location.country}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                {venue.meta.wifi && (
                  <Tooltip title="WiFi Available">
                    <Chip icon={<WifiIcon />} label="WiFi" />
                  </Tooltip>
                )}
                {venue.meta.parking && (
                  <Tooltip title="Parking Available">
                    <Chip icon={<LocalParkingIcon />} label="Parking" />
                  </Tooltip>
                )}
                {venue.meta.breakfast && (
                  <Tooltip title="Breakfast Included">
                    <Chip icon={<RestaurantIcon />} label="Breakfast" />
                  </Tooltip>
                )}
                {venue.meta.pets && (
                  <Tooltip title="Pet Friendly">
                    <Chip icon={<PetsIcon />} label="Pet Friendly" />
                  </Tooltip>
                )}
              </Stack>

              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {venue.description}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Location Details
              </Typography>
              <Box 
                component={Paper} 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05)
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {venue.location.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      City
                    </Typography>
                    <Typography variant="body1">
                      {venue.location.city}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Country
                    </Typography>
                    <Typography variant="body1">
                      {venue.location.country}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Continent
                    </Typography>
                    <Typography variant="body1">
                      {venue.location.continent}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                position: 'sticky', 
                top: 24,
                bgcolor: 'background.paper'
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    €{venue.price}
                    <Typography component="span" variant="body1" color="text.secondary">
                      /night
                    </Typography>
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Rating value={venue.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({venue.rating})
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Select Dates
                  </Typography>
                  <Stack spacing={2}>
                    <DatePicker 
                      label="Check-in"
                      value={selectedDates.startDate}
                      onChange={(date) => handleDateChange('startDate', date)}
                      disablePast
                      shouldDisableDate={(date) => isDateBooked(date, bookings)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small"
                        }
                      }}
                    />
                    <DatePicker 
                      label="Check-out"
                      value={selectedDates.endDate}
                      onChange={(date) => handleDateChange('endDate', date)}
                      disablePast
                      shouldDisableDate={(date) => isDateBooked(date, bookings)}
                      minDate={selectedDates.startDate || undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small"
                        }
                      }}
                    />
                  </Stack>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => user ? setOpenBooking(true) : navigate('/login')}
                  disabled={!selectedDates.startDate || !selectedDates.endDate}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  {user ? 'Book Now' : 'Login to Book'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Hosted by {venue.owner.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maximum {venue.maxGuests} guests allowed
                  </Typography>
                </Box>
              </Stack>
             </Paper>
          </Grid>
        </Grid>

        {/* Image Gallery Dialog */}
        <Dialog 
          open={openImageDialog} 
          onClose={() => setOpenImageDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black' }}>
            <IconButton
              onClick={() => setOpenImageDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                bgcolor: alpha(theme.palette.common.black, 0.5),
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.black, 0.7)
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={mediaImages[currentImageIndex].url}
              alt={mediaImages[currentImageIndex].alt || venue.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
            {mediaImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: alpha(theme.palette.common.black, 0.5),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.black, 0.7)
                    }
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: alpha(theme.palette.common.black, 0.5),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.black, 0.7)
                    }
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </>
            )}
          </DialogContent>
        </Dialog>

        <BookingDialog
          open={openBooking}
          onClose={() => setOpenBooking(false)}
          venue={venue}
          dates={selectedDates}
          onBook={async (guests) => {
            try {
              if (!selectedDates.startDate || !selectedDates.endDate) return;
              await bookingService.createBooking(venue.id, {
                dateFrom: formatDateISO(selectedDates.startDate),
                dateTo: formatDateISO(selectedDates.endDate),
                guests
              });
              navigate('/my-bookings');
            } catch (err) {
              setError('Failed to create booking');
            }
          }}
        />
      </Container>
    </Box>
  );
};

export default VenueDetails;