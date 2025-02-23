import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { venueService } from '../services/venue.service';
import { Venue } from '../types/api.types';

interface Location {
  id: string;
  type: 'city' | 'country';
  label: string;
  count: number;
}

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venues = await venueService.getVenues();
        
        // Get featured venues (highest rated)
        const featured = [...venues]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setFeaturedVenues(featured);

        // Extract unique locations
        const cities = new Map<string, number>();
        const countries = new Map<string, number>();

        venues.forEach(venue => {
          const { city, country } = venue.location;
          if (city) {
            const cityKey = city.toLowerCase();
            cities.set(cityKey, (cities.get(cityKey) || 0) + 1);
          }
          if (country) {
            const countryKey = country.toLowerCase();
            countries.set(countryKey, (countries.get(countryKey) || 0) + 1);
          }
        });

        const locationOptions: Location[] = [];

        // Add cities
        cities.forEach((count, city) => {
          locationOptions.push({
            id: `city-${city}`,
            type: 'city',
            label: city.charAt(0).toUpperCase() + city.slice(1),
            count
          });
        });

        // Add countries
        countries.forEach((count, country) => {
          locationOptions.push({
            id: `country-${country}`,
            type: 'country',
            label: country.charAt(0).toUpperCase() + country.slice(1),
            count
          });
        });

        setLocations(locationOptions);
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
    navigate(`/venues?search=${location.type}:${location.label}`);
  };

  // Rest of the component remains the same...
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

              <Box
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
                  groupBy={(option) => option.type === 'city' ? 'Cities' : 'Countries'}
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
                    <Box component="li" {...props} key={option.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body1">
                            {option.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.type === 'city' ? 'City' : 'Country'} • {option.count} {option.count === 1 ? 'venue' : 'venues'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>
            </Grid>
            
            {/* 3D Cards Section */}
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
                {featuredVenues.map((venue, index) => (
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
    </Box>
  );
};

export default Home;