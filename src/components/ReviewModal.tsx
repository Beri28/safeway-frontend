import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

interface ReviewModalProps {
  open: boolean;
  ticket: any;
  onSubmit: (review: { rating: number; comment: string }) => void;
  onClose: () => void;
}

const ReviewModal = ({ open, ticket, onSubmit, onClose }: ReviewModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Rating value={rating} onChange={(_, v) => setRating(v)} />
          <TextField
            label="Comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!rating} onClick={() => onSubmit({ rating: rating || 0, comment })}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
