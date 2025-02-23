import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Rating,
  Chip,
  Stack,
  Autocomplete,
  TextField,
  InputAdornment,
  Alert,
  Skeleton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { venueService } from '../services/venue.service';
import { Venue } from '../types/api.types';

interface SearchOption {
  id: string;
  type: 'city' | 'country' | 'venue';
  label: string;
  count?: number;
}

const Venues = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState<SearchOption | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await venueService.getVenues();
        setVenues(data);
      } catch (err) {
        setError('Failed to load venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Get search query from URL and set initial search value
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search && venues.length > 0) {
      const [type, value] = search.split(':');
      if (type && value) {
        let count;
        if (type !== 'venue') {
          count = venues.filter(venue => 
            type === 'city' 
              ? venue.location.city?.toLowerCase() === value.toLowerCase()
              : venue.location.country?.toLowerCase() === value.toLowerCase()
          ).length;
        }
        
        setSearchValue({
          id: `${type}-${value.toLowerCase()}`,
          type: type as 'city' | 'country' | 'venue',
          label: value,
          count
        });
      }
    }
  }, [location.search, venues]);

  // Generate search options from venues
  const searchOptions = useMemo(() => {
    if (!venues.length) return [];

    const options: SearchOption[] = [];
    const cities = new Map<string, number>();
    const countries = new Map<string, number>();

    // Add all venue names first
    venues.forEach(venue => {
      options.push({
        id: `venue-${venue.id}`,
        type: 'venue',
        label: venue.name
      });

      // Collect location data
      if (venue.location.city) {
        const city = venue.location.city.toLowerCase();
        cities.set(city, (cities.get(city) || 0) + 1);
      }
      if (venue.location.country) {
        const country = venue.location.country.toLowerCase();
        countries.set(country, (countries.get(country) || 0) + 1);
      }
    });

    // Add cities
    cities.forEach((count, city) => {
      options.push({
        id: `city-${city}`,
        type: 'city',
        label: city.charAt(0).toUpperCase() + city.slice(1),
        count
      });
    });

    // Add countries
    countries.forEach((count, country) => {
      options.push({
        id: `country-${country}`,
        type: 'country',
        label: country.charAt(0).toUpperCase() + country.slice(1),
        count
      });
    });

    return options;
  }, [venues]);

  // Filter venues based on search selection
  const filteredVenues = useMemo(() => {
    if (!searchValue) return venues;

    return venues.filter(venue => {
      switch (searchValue.type) {
        case 'city':
          return venue.location.city?.toLowerCase() === searchValue.label.toLowerCase();
        case 'country':
          return venue.location.country?.toLowerCase() === searchValue.label.toLowerCase();
        case 'venue':
          return venue.name.toLowerCase() === searchValue.label.toLowerCase();
        default:
          return true;
      }
    });
  }, [venues, searchValue]);

  const handleSearchChange = (event: any, newValue: SearchOption | null) => {
    setSearchValue(newValue);
    
    // Update URL
    const searchParams = new URLSearchParams(location.search);
    if (newValue) {
      searchParams.set('search', `${newValue.type}:${newValue.label}`);
    } else {
      searchParams.delete('search');
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {searchValue 
            ? `${searchValue.type === 'venue' ? 'Venue:' : 'Venues in'} ${searchValue.label}`
            : 'Discover Amazing Venues'
          }
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {searchValue 
            ? `Showing ${filteredVenues.length} ${searchValue.type === 'venue' ? 'matching venue' : 'venues'}`
            : 'Find and book unique accommodations around the world'
          }
        </Typography>

        <Autocomplete
          value={searchValue}
          onChange={handleSearchChange}
          options={searchOptions}
          groupBy={(option) => option.type.charAt(0).toUpperCase() + option.type.slice(1)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search by venue name, city, or country..."
              fullWidth
              sx={{ mt: 3, mb: 4 }}
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
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="body1">
                    {option.label}
                  </Typography>
                  {option.count && (
                    <Typography variant="body2" color="text.secondary">
                      {option.type === 'city' ? 'City' : 'Country'} • {option.count} {option.count === 1 ? 'venue' : 'venues'}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {filteredVenues.map((venue) => (
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
                image={venue.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                alt={venue.name}
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
                  {venue.meta.wifi && <Chip label="WiFi" size="small" />}
                  {venue.meta.parking && <Chip label="Parking" size="small" />}
                  {venue.meta.breakfast && <Chip label="Breakfast" size="small" />}
                  {venue.meta.pets && <Chip label="Pet Friendly" size="small" />}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={venue.rating} precision={0.5} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({venue.rating})
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    €{venue.price}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /night
                    </Typography>
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate(`/venues/${venue.id}`)}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredVenues.length === 0 && (
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
            No venues found matching your search criteria
          </Typography>
          <Button 
            variant="contained"
            onClick={() => {
              setSearchValue(null);
              navigate('/venues');
            }}
            sx={{ mt: 2 }}
          >
            Clear Search
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Venues;