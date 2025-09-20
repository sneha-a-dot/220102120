import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';
import { Log } from '../utils/log';

export default function UrlRedirectHandler() {
  const { shortcode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function redirect() {
      try {
        const res = await fetch(`http://localhost:5000/${shortcode}`, { redirect: 'manual' });
        
        if (res.status === 404) {
          setError('Short URL not found.');
          Log('frontend', 'error', 'UrlRedirectHandler', `Shortcode ${shortcode} not found`);
          setLoading(false);
        } else if (res.status === 410) {
          setError('Short URL expired.');
          Log('frontend', 'warn', 'UrlRedirectHandler', `Shortcode ${shortcode} expired`);
          setLoading(false);
        } else if (res.status === 302 || res.status === 301) {
          const location = res.headers.get('location');
          Log('frontend', 'info', 'UrlRedirectHandler', `Redirecting to ${location}`);
          window.location.href = location;
        } else {
          setError('Unexpected error occurred.');
          Log('frontend', 'fatal', 'UrlRedirectHandler', `Unexpected status code: ${res.status}`);
          setLoading(false);
        }
      } catch (err) {
        setError('Network or server error during redirection.');
        Log('frontend', 'fatal', 'UrlRedirectHandler', `Fetch error: ${err.message}`);
        setLoading(false);
      }
    }
    redirect();
  }, [shortcode]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography>Redirecting...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" sx={{ mt: 5, color: 'red', textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return null; // nothing to render while redirecting
}
