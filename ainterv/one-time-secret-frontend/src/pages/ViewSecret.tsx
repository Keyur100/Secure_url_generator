import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Link as MuiLink,
  Box,
} from '@mui/material';
import { fetchSecret } from '../api';

export default function ViewSecret() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSecret = async () => {
      try {
        const res = await fetchSecret(id || '');
        setSecret(res.secret);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
          'Unable to fetch the secret. It may have expired or already been viewed.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSecret();
  }, [id]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h5" gutterBottom>
          View One-Time Secret
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{secret}</Typography>
          </Alert>
        )}

        {/* Back to Home Link */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <MuiLink
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{ fontWeight: 'bold' }}
          >
            ← Back to Generate New Secrets
          </MuiLink>
        </Box>
      </Paper>
    </Container>
  );
}
