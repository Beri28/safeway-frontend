import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Stack from '@mui/material/Stack';

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const AuthPromptModal = ({ open, onClose, onLogin, onRegister }: AuthPromptModalProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
      Sign In Required
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1" color="text.secondary" mb={2}>
        You need to be logged in to book a ticket. Please sign in or create an account to continue.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
      <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
        <Button variant="outlined" color="primary" onClick={onLogin} fullWidth>Sign In</Button>
        <Button variant="contained" color="primary" onClick={onRegister} fullWidth>Create Account</Button>
      </Stack>
    </DialogActions>
  </Dialog>
);

export default AuthPromptModal;
