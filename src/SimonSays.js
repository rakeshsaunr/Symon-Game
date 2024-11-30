import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Define the colors and difficulty levels
const colors = ['red', 'blue', 'green', 'yellow'];
const difficultyLevels = [1000, 800, 600, 400]; // Sequence speed for each difficulty level

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [gameState, setGameState] = useState('waiting');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(0); // Start with the easiest level
  const intervalRef = useRef(null);

  // Update the audio files' paths
  const clickSound = new Audio(`${process.env.PUBLIC_URL}/click.mp3`);
  const flashSound = new Audio(`${process.env.PUBLIC_URL}/flash.mp3`);

  // Handle error loading audio files
  clickSound.onerror = () => {
    console.error("Error loading click sound.");
  };
  flashSound.onerror = () => {
    console.error("Error loading flash sound.");
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timeout = setTimeout(() => {
        playSequence();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  const generateRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const addToSequence = () => {
    setSequence((prev) => [...prev, generateRandomColor()]);
    setUserSequence([]);
  };

  const playSequence = () => {
    let index = 0;
    const speed = difficultyLevels[difficulty] || 1000;
    intervalRef.current = setInterval(() => {
      if (index >= sequence.length) {
        clearInterval(intervalRef.current);
        setMessage('Your turn!');
        setGameState('user');
        return;
      }
      flashColor(sequence[index]);
      index++;
    }, speed);
  };

  const flashColor = (color) => {
    const button = document.getElementById(color);
    button.classList.add('flash');
    flashSound.play();
    setTimeout(() => {
      button.classList.remove('flash');
    }, 500);
  };

  const handleClick = (color) => {
    clickSound.play();
    if (gameState === 'user') {
      const newSequence = [...userSequence, color];
      setUserSequence(newSequence);
      flashColor(color);

      if (newSequence.length === sequence.length) {
        if (newSequence.join(',') === sequence.join(',')) {
          setMessage('Correct! Next round.');
          setScore((prev) => prev + 1);
          setDifficulty((prev) => Math.min(prev + 1, difficultyLevels.length - 1)); // Increase difficulty
          setGameState('waiting');
          addToSequence();
        } else {
          setMessage('Wrong sequence! Try again.');
          setScore(0); // Reset score
          setDifficulty(0); // Reset difficulty
          setGameState('waiting');
          setSequence([]);
        }
      }
    }
  };

  return (
    <div className="game-container">
      <h1>Simon Says</h1>
      <p>Score: {score}</p>
      <div className="buttons">
        {colors.map((color) => (
          <button
            key={color}
            id={color}
            className={`color-button ${color}`}
            onClick={() => handleClick(color)}
          />
        ))}
      </div>
      <button className='game' onClick={() => { setMessage('Watch the sequence!'); addToSequence(); setGameState('playing'); }}>
        Start Game
      </button>
      <p>{message}</p>
    </div>
  );
};

export default SimonSays;
