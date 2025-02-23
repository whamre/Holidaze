import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Alert,
  Skeleton,
  Stack,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/booking.service';
import { Booking } from '../types/api.types';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { formatDate, isAfter, isBefore, parseDate, calculateNights } from '../utils/dateUtils';

const MyBookings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getUserBookings();
        // Sort bookings by date (upcoming first)
        const sorted = data.sort((a, b) => {
          return parseDate(a.dateFrom).getTime() - parseDate(b.dateFrom).getTime();
        });
        setBookings(sorted);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getBookingStatus = (booking: Booking) => {
    const now = new Date();
    const startDate = parseDate(booking.dateFrom);
    const endDate = parseDate(booking.dateTo);

    if (isAfter(now, endDate)) {
      return 'completed';
    } else if (isBefore(now, startDate)) {
      return 'upcoming';
    } else {
      return 'active';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'upcoming':
        return theme.palette.primary.main;
      case 'completed':
        return theme.palette.text.secondary;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Currently Staying';
      case 'upcoming':
        return 'Upcoming Stay';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} key={item}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            My Bookings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and track your venue reservations
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <EventBusyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You don't have any bookings yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start exploring amazing venues and plan your next stay
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/venues')}
              startIcon={<EventAvailableIcon />}
              size="large"
            >
              Browse Venues
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {bookings.map((booking) => {
              const status = getBookingStatus(booking);
              const nights = calculateNights(parseDate(booking.dateFrom), parseDate(booking.dateTo));
              const totalPrice = booking.venue!.price * nights;

              return (
                <Grid item xs={12} key={booking.id}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      display: 'flex',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: 300,
                        height: '100%',
                        objectFit: 'cover',
                        display: { xs: 'none', sm: 'block' }
                      }}
                      image={booking.venue?.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                      alt={booking.venue?.name}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <CardContent sx={{ flex: '1 0 auto', p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                              {booking.venue?.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <LocationOnIcon color="action" sx={{ fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {booking.venue?.location.city}, {booking.venue?.location.country}
                              </Typography>
                            </Stack>
                          </Box>
                          <Chip 
                            label={getStatusLabel(status)}
                            sx={{ 
                              bgcolor: alpha(getStatusColor(status), 0.1),
                              color: getStatusColor(status),
                              fontWeight: 500
                            }}
                          />
                        </Box>

                        <Grid container spacing={4} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Check-in
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {formatDate(parseDate(booking.dateFrom))}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Duration
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {nights} {nights === 1 ? 'night' : 'nights'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Check-out
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {formatDate(parseDate(booking.dateTo))}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Guests
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Total Price
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                              €{totalPrice}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            endIcon={<NavigateNextIcon />}
                            onClick={() => navigate(`/venues/${booking.venue?.id}`)}
                          >
                            View Venue
                          </Button>
                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyBookings;