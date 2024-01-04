import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [text, setText] = useState('');
  const [audioURL, setAudioURL] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const synthesizeSpeech = async () => {
    try {
      const response = await axios.post('http://localhost:3001/synthesize', {
        text: text,
      }, {
        responseType: 'blob'
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAudioEnd = () => {
    setAudioURL('');
  };

  return (
    <div className="hero">
      <h1>Text to Speech <span>Converter</span></h1>
      <textarea placeholder="Write anything here.." value={text} onChange={handleTextChange}></textarea>
      <div className="row">
        <select>
          {/* Add options to select if needed */}
        </select>
        <button onClick={synthesizeSpeech}>Speak</button>
      </div>
      {audioURL && (
        <audio controls onEnded={handleAudioEnd}>
          <source src={audioURL} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default App;
