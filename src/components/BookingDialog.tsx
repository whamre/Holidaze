import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Venue } from '../types/api.types';
import { formatDate, calculateNights } from '../utils/dateUtils';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  venue: Venue;
  dates: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onBook: (guests: number) => Promise<void>;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  venue,
  dates,
  onBook
}) => {
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    try {
      setLoading(true);
      setError('');
      await onBook(guests);
      onClose();
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nights = dates.startDate && dates.endDate ? calculateNights(dates.startDate, dates.endDate) : 0;
  const totalPrice = venue.price * nights;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Booking</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {venue.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {dates.startDate && dates.endDate
              ? `${formatDate(dates.startDate)} - ${formatDate(dates.endDate)}`
              : 'Select dates'}
          </Typography>
        </Box>

        <TextField
          label="Number of Guests"
          type="number"
          fullWidth
          value={guests}
          onChange={(e) => setGuests(Math.min(venue.maxGuests, Math.max(1, parseInt(e.target.value) || 1)))}
          inputProps={{
            min: 1,
            max: venue.maxGuests
          }}
          helperText={`Maximum ${venue.maxGuests} guests allowed`}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary">
          Total price: €{totalPrice}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleBook}
          variant="contained"
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;