import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const colorMap = {
  blue: '#1976d2',
  red: '#d32f2f',
  green: '#388e3c',
};

const CircularCounter = ({ number = 1, color = 'blue', percentage = 0 }) => {
  const progressColor = colorMap[color] || colorMap.blue;
  console.log('perc',percentage);
  return (
    <Box sx={{ position: 'relative', height: 120 }}>
      {/* Line below */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60
        }}
      />

      {/* Floating Circular Counter */}
      <Box
        sx={{
          position: 'absolute',
          top: '96%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      >
        {/* White Background Circle */}
        <Box
          sx={{
            position: 'relative',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background Circle */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={100}
            thickness={4}
            sx={{
              color: '#e0e0e0',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />

          {/* Foreground Progress */}
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={100}
            thickness={4}
            sx={{
              color: progressColor,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />

          {/* Centered Text */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 14, color: progressColor }}>
              سؤال
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              {String(number).padStart(2, '0')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CircularCounter;
