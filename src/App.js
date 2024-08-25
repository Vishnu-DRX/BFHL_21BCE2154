import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const options = [
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' }
];

const App = () => {
  const [formData, setFormData] = useState({ inputData: '' });
  const [apiResponse, setApiResponse] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');

      // Validate input to ensure it only contains alphabets, numbers, and spaces
      const isValidInput = /^[a-zA-Z0-9 ]+$/.test(formData.inputData.trim());
      if (!isValidInput) {
        setError('Input should only contain alphabets, numbers, and spaces.');
        // Clear previously displayed data and selected options
        setApiResponse(null);
        setDropdownOptions([]);
        setSelectedOptions([]);
        setSubmittedData(null);
        return;
      }

      // Split the input by spaces
      const data = formData.inputData.trim().split(' ');

      // Compute the highest lowercase alphabet
      const alphabetsArray = data.filter(char => /^[a-z]$/.test(char));
      const highestLowercaseAlphabet = alphabetsArray.length > 0 ? alphabetsArray.sort().pop() : '';

      // Add the highest lowercase alphabet to the data array if it exists
      if (highestLowercaseAlphabet) {
        data.push(highestLowercaseAlphabet);
      }

      // Prepare the final payload
      const payload = { data };

      // Call your REST API here
      const response = await axios.post('https://bfhl-21bce2154.onrender.com/bfhl', payload);
      setApiResponse(response.data);
      setSubmittedData(payload.data);
      console.log(response);

      // Show dropdown options after successful API call
      setDropdownOptions(['Alphabets', 'Numbers', 'Highest lowercase alphabet']);
      setSelectedOptions([]); // Reset selected options to avoid displaying stale data
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
      setApiResponse(null);
      setDropdownOptions([]);
      setSelectedOptions([]);
      setSubmittedData(null);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const getDataToDisplay = () => {
    if (!apiResponse) return null;

    const selectedValues = selectedOptions.map(option => option.value);

    let result = {};
    if (selectedValues.includes('Alphabets')) {
      result.alphabets = apiResponse.alphabets || [];
    }
    if (selectedValues.includes('Numbers')) {
      result.numbers = apiResponse.numbers || [];
    }
    if (selectedValues.includes('Highest lowercase alphabet')) {
      result.highest_lowercase_alphabet = apiResponse.highest_lowercase_alphabet || [];
    }
    return result;
  };

  return (
    <div className="App">
      <header>
        <h1>Enter JSON Data</h1>
      </header>

      <div className="form-container">
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>Input (Alphabets & Numbers):</label>
            <input
              type="text"
              name="inputData"
              value={formData.inputData}
              onChange={handleInputChange}
              placeholder="Enter alphabets and numbers separated by spaces"
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {submittedData && (
          <div>
            <h3>POST request Data:</h3>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}

        {apiResponse && (
          <div>
            <label>Select Data to Display:</label>
            <Select
              isMulti
              options={options}
              value={selectedOptions}
              onChange={handleSelectChange}
              placeholder="Select options"
            />
          </div>
        )}

        {selectedOptions.length > 0 && (
          <div>
            <h3>Displayed Data:</h3>
            <pre>{JSON.stringify(getDataToDisplay(), null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
