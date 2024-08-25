import express from 'express';
import cors from 'cors';//for cross orgine resource sharing
import bodyParser from 'body-parser';//to parse the req.body as json

const app = express();
const port = 5000; // Choose any available port

app.use(cors());
app.use(bodyParser.json());

// POST route to process the incoming data
app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, error: 'Invalid data format. Expected an array.' });
  }

  // Extract alphabets and numbers
  const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
  const numbers = data.filter(item => /^[0-9]+$/.test(item));

  // Compute the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter(char => /^[a-z]$/.test(char));
  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? lowercaseAlphabets.sort().pop() : null;

  // Prepare the response
  const response = {
    is_success: true,
    user_id: 'vishnu_a_19062003',
    email: 'vishnu.a2021@vitstudent.ac.in',
    roll_number: '21BCE2154',
    numbers: numbers.length > 0 ? numbers : null,
    alphabets: alphabets.length > 0 ? alphabets : null,
    highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : null,
  };

  res.json(response);
});

// GET route for operation code
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
