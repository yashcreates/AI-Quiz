import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const topics = ['Indian History', 'Geography', 'Sports'];

const App = () => {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rightwrong, setRW] = useState('');

  const generateQuestion = async () => {
    try {
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: `Create a question on ${selectedTopic} which has a one word answer,dont write the ans,only give the question` }] }]
      });

      const generatedQuestion = response.data.candidates[0].content.parts[0].text;
      setQuestion(generatedQuestion);
      setCorrectAnswer(''); // Reset correct answer and feedback
      setFeedback('');
    } catch (error) {
      console.error('Error generating question:', error);
    }
  };

  const checkAnswer = async () => {
    try {
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: ` ${question}. give answer in two lines only` }] }]
      });

      const generatedFeedback = response.data.candidates[0].content.parts[0].text;
      setFeedback(generatedFeedback);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const checkRW = async () => {
    try {
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: `The answer to the question: ${question} is ${userAnswer}. Is this correct? Only tell RIGHT or WRONG` }] }]
      });

      const generatedFeedback = response.data.candidates[0].content.parts[0].text;
      const trimmedFeedback = generatedFeedback.trim().toUpperCase(); // Ensure trimming and convert to uppercase

      if (trimmedFeedback === 'RIGHT' || trimmedFeedback === 'WRONG') {
        setRW(trimmedFeedback);
      } else {
        console.error('Unexpected feedback:', generatedFeedback);
        setRW('');
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  return (
    <div className="App">
      <h1>AI Quiz App</h1>
      <div>
        <label>Select Topic:</label>
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <button onClick={generateQuestion}>Generate Question</button>
      </div>
      {question && (
        <div>
          <h2>Question:</h2>
          <p>{question}</p>
          <input
            type="text"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <button onClick={() => { checkAnswer(); checkRW(); }}>Check Answer</button>
        </div>
      )}
      {feedback && rightwrong && (
        <div>
          <h2 style={{ color: rightwrong === 'RIGHT' ? 'green' : 'red' }}>{rightwrong} Answer</h2>
          <h2>Feedback:</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default App;
