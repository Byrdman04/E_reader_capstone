import { useState, useRef, useEffect } from 'react';

export function useSpeech(content) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(75);
  const [highlightIndex, setHighlightIndex] = useState({ start: -1, length: 0 });

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => synthRef.current.cancel();
  }, []);

  const handlePlayPause = () => {
    const synth = synthRef.current;

    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
      return;
    }

    if (synth.paused) {
      synth.resume();
      setIsPlaying(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = speed;
    utterance.volume = volume / 100;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setHighlightIndex({ start: event.charIndex, length: event.charLength });
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setHighlightIndex({ start: -1, length: 0 });
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsPlaying(true);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (utteranceRef.current) utteranceRef.current.rate = newSpeed;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (utteranceRef.current) utteranceRef.current.volume = newVolume / 100;
  };

  const stop = () => {
    synthRef.current.cancel();
    setIsPlaying(false);
    setHighlightIndex({ start: -1, length: 0 });
  };

  return {
    isPlaying,
    speed,
    volume,
    highlightIndex,
    handlePlayPause,
    handleSpeedChange,
    handleVolumeChange,
    stop,
  };
}