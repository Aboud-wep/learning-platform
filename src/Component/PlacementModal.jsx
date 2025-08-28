import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CompassIcon from '../Component/ui/compass'
import BookIcon from '../Component/ui/book'
const PlacementModal = ({ open, onClose , subjectId}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selectedOption === 'beginner') {
      navigate(`/levels-map/${subjectId}`)
    } else if (selectedOption === 'level') {
      navigate(`/test/${subjectId}`);
    }
  };

  const options = [
    {
      key: 'level',
      title: 'اختبار تحديد المستوى',
      description: 'قم بعمل اختبار بسيط لتتعرف أي من أي مستوى تستطيع أن تبدأ.',
      icon:<CompassIcon />
      
    },
    {
      key: 'beginner',
      title: 'ابدأ من الصفر',
      description: 'إن كانت هذه المرة الأولى التي تدرس فيها هذا العلم، فابدأ من نقطة البداية.',
      icon:<BookIcon />
      
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" mb={3}>
          اختر نقطة البداية
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'nowrap', // prevent wrapping to new lines
          }}
        >
          {options.map((option) => (
            <Paper
              key={option.key}
              elevation={selectedOption === option.key ? 6 : 2}
              onClick={() => setSelectedOption(option.key)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: selectedOption === option.key ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: 2,
                flex: 1, // equal width distribution
                minWidth: 200, // minimum width to prevent too narrow cards
                maxWidth: 250, // maximum width to maintain proportions
              }}
            >
                <Box 
                  sx={{
                    justifyContent:'center',
                    display:'flex'
                  }}
                >
                  {option.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {option.title}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {option.description}
                </Typography>
              </Paper>
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          disabled={!selectedOption}
          onClick={handleConfirm}
        >
          تأكيد
        </Button>
      </Box>
    </Modal>
  );
};

export default PlacementModal;
