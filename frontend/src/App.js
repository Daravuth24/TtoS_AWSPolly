import React, { useState } from 'react';
import axios from 'axios';

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
        // You can add a voiceId if needed (e.g., 'voiceId: 'Joanna'')
      }, {
        responseType: 'blob' // Treat response as binary data
      });

      // Create an audio URL from the received audio blob
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleAudioEnd = () => {
    // Clear the audio URL when playback ends
    setAudioURL('');
  };

  return (
    <div>
      <h1>Text-to-Speech Synthesis</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder="Enter text here..."
        value={text}
        onChange={handleTextChange}
      ></textarea>
      <br />
      <button onClick={synthesizeSpeech}>Synthesize</button>
      <br />
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
