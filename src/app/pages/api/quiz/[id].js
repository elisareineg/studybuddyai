export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Quiz ID is required' });
      }
      
      // Here you would fetch the quiz from your database
      // For now, we'll return mock data
      const quiz = {
        id,
        title: 'Photosynthesis Quiz',
        createdAt: new Date().toISOString(),
        questions: [
          {
            id: '1',
            type: 'multiple-choice',
            question: 'What is the primary function of photosynthesis?',
            options: [
              'To convert light energy into chemical energy',
              'To convert chemical energy into light energy',
              'To break down glucose for energy',
              'To extract minerals from soil'
            ],
            correctAnswer: 0
          },
          {
            id: '2',
            type: 'true-false',
            question: 'Photosynthesis occurs in the mitochondria of plant cells.',
            correctAnswer: 'False'
          },
          {
            id: '3',
            type: 'short-answer',
            question: 'Describe the two main stages of photosynthesis.',
            correctAnswer: 'The light-dependent reactions and the Calvin cycle.'
          },
          {
            id: '4',
            type: 'fill-in-blank',
            question: 'The chemical equation for photosynthesis shows that plants produce glucose and ______.',
            correctAnswer: 'oxygen'
          },
          {
            id: '5',
            type: 'multiple-choice',
            question: 'Which pigment is primarily responsible for absorbing light during photosynthesis?',
            options: [
              'Melanin',
              'Chlorophyll',
              'Carotene',
              'Hemoglobin'
            ],
            correctAnswer: 1
          }
        ]
      };
  
      return res.status(200).json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return res.status(500).json({ error: 'Failed to fetch quiz' });
    }
  }
  