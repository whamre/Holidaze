import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Stack,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Paper,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PetsIcon from '@mui/icons-material/Pets';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CabinIcon from '@mui/icons-material/Cabin';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VillaIcon from '@mui/icons-material/Villa';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../services/venue.service';
import { Venue } from '../types/api.types';

interface Location {
  city: string;
  country: string;
  label: string;
}

const categories = [
  { 
    name: 'Beach Houses', 
    icon: <BeachAccessIcon />, 
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&h=500&q=80' 
  },
  { 
    name: 'Cabins', 
    icon: <CabinIcon />, 
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&h=500&q=80' 
  },
  { 
    name: 'Apartments', 
    icon: <ApartmentIcon />, 
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&h=500&q=80' 
  },
  { 
    name: 'Villas', 
    icon: <VillaIcon />, 
    image: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?auto=format&fit=crop&w=800&h=500&q=80' 
  }
];

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [trendingVenues, setTrendingVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState<Location | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venues = await venueService.getVenues();
        
        // Get featured venues (highest rated)
        const featured = [...venues]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setFeaturedVenues(featured);

        // Get trending venues (most recent)
        const trending = [...venues]
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
          .slice(0, 6);
        setTrendingVenues(trending);

        // Extract unique locations
        const locationMap = new Map<string, Location>();
        venues.forEach(venue => {
          const { city, country } = venue.location;
          if (!city || !country) return;
          
          const cityKey = `${city}, ${country}`;
          if (!locationMap.has(cityKey)) {
            locationMap.set(cityKey, {
              city,
              country,
              label: cityKey
            });
          }
        });
        setLocations(Array.from(locationMap.values()));
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleSearch = (location: Location | null) => {
    if (!location) return;
    navigate(`/venues?search=${encodeURIComponent(location.label)}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: { xs: 'calc(100vh - 64px)', md: '100vh' },
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          pt: { xs: 4, md: 0 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: {
              xs: 'rgba(0,0,0,0.6)',
              md: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
            },
            zIndex: 1
          }
        }}
      >
        <Container 
          maxWidth={false}
          sx={{ 
            position: 'relative', 
            zIndex: 2,
            px: { xs: 2, sm: 4, md: 8 },
            maxWidth: '2000px'
          }}
        >
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            sx={{ 
              maxWidth: '1800px',
              mx: 'auto'
            }}
          >
            <Grid 
              item 
              xs={12} 
              md={6} 
              lg={5}
              sx={{
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { 
                    xs: '2rem',
                    sm: '2.5rem', 
                    md: '3.5rem', 
                    lg: '4rem' 
                  },
                  fontWeight: 800,
                  mb: { xs: 2, md: 3 },
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  color: 'white'
                }}
              >
                Experience Unique Stays Around the World
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: { xs: 3, md: 4 },
                  opacity: 0.9,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: 'white'
                }}
              >
                From cozy cabins to luxury villas, find the perfect venue for your next adventure
              </Typography>
              
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(4px)',
                  maxWidth: { xs: '100%', md: '600px' },
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: 'text.primary'
                  }}
                >
                  Where would you like to go?
                </Typography>
                <Autocomplete
                  options={locations}
                  value={searchQuery}
                  onChange={(_, newValue) => {
                    setSearchQuery(newValue);
                    handleSearch(newValue);
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search destinations..."
                      fullWidth
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.label}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {option.label}
                    </Box>
                  )}
                />
              </Paper>
            </Grid>
            
            <Grid 
              item 
              xs={12} 
              md={6} 
              lg={7}
              sx={{
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Grid 
                container 
                spacing={2}
                sx={{
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {featuredVenues.slice(0, 3).map((venue, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    key={venue.id}
                    sx={{ 
                      transform: `translateX(${index * 40}px) translateZ(${index * 20}px)`,
                      opacity: loading ? 0 : 1,
                      transition: 'all 0.5s ease-out',
                      transitionDelay: `${index * 0.2}s`
                    }}
                  >
                    <Card
                      onClick={() => navigate(`/venues/${venue.id}`)}
                      sx={{
                        display: 'flex',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: (theme) => alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          transform: 'translateX(16px) scale(1.02)',
                          boxShadow: theme.shadows[20]
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 180, height: 180 }}
                        image={venue.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                        alt={venue.name}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ color: 'text.primary' }}
                        >
                          {venue.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {venue.location.city}, {venue.location.country}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Rating value={venue.rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            ({venue.rating})
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: { xs: 4, md: 6 },
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Explore by Category
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}
                onClick={() => navigate('/venues')}
              >
                <Box sx={{ paddingTop: '62.5%', position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={category.image}
                    alt={category.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    p: { xs: 1, sm: 2 },
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {category.icon}
                    <Typography 
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1.25rem' }
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Trending Venues Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              mb: { xs: 4, md: 6 },
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Trending Now
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {trendingVenues.map((venue) => (
                <Grid item xs={12} sm={6} md={4} key={venue.id}>
                  <Card
                    onClick={() => navigate(`/venues/${venue.id}`)}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Box sx={{ paddingTop: '66.67%', position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={venue.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&h=533&q=80'}
                        alt={venue.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }}
                      >
                        {venue.name}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                        <Typography color="text.secondary">
                          {venue.location.city}, {venue.location.country}
                        </Typography>
                      </Stack>

                      <Stack 
                        direction="row" 
                        spacing={1} 
                        sx={{ 
                          mb: 2,
                          flexWrap: 'wrap',
                          gap: 1 
                        }}
                      >
                        {venue.meta.wifi && <WifiIcon color="action" />}
                        {venue.meta.parking && <LocalParkingIcon color="action" />}
                        {venue.meta.breakfast && <RestaurantIcon color="action" />}
                        {venue.meta.pets && <PetsIcon color="action" />}
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                      >
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                          €{venue.price}
                          <Typography component="span" variant="body2" color="text.secondary">
                            /night
                          </Typography>
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={venue.rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            ({venue.rating})
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 10, md: 15 },
          textAlign: 'center',
          color: 'white',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: { xs: 2, md: 3 },
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Start Hosting Your Venue
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: { xs: 3, md: 4 },
              opacity: 0.9,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Turn your property into a successful business
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              py: { xs: 1.5, md: 2 },
              px: { xs: 4, md: 6 },
              fontSize: { xs: '1rem', md: '1.2rem' },
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Become a Host
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;