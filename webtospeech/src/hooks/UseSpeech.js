import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpeech(content) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(75);
  const [highlightIndex, setHighlightIndex] = useState({ start: -1, length: 0 });

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const charOffsetRef = useRef(0); // tracks position for restarts

  useEffect(() => {
  const synth = synthRef.current; // capture ref value
  return () => synth.cancel();
  }, []);

  // Cancel and reset highlight when page content changes
  useEffect(() => {
    synthRef.current.cancel();
    setIsPlaying(false);
    setHighlightIndex({ start: -1, length: 0 });
    charOffsetRef.current = 0;
  }, [content]);

  const startUtterance = useCallback((offset = 0) => {
    const synth = synthRef.current;
    synth.cancel();

    const textToSpeak = content.slice(offset);
    if (!textToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speed;
    utterance.volume = volume / 100;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        charOffsetRef.current = offset + event.charIndex;
        setHighlightIndex({ start: offset + event.charIndex, length: event.charLength });
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setHighlightIndex({ start: -1, length: 0 });
      charOffsetRef.current = 0;
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [content, speed, volume]);

  const handlePlayPause = useCallback(() => {
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

    startUtterance(0);
    setIsPlaying(true);
  }, [isPlaying, startUtterance]);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      // Restart from current word position with new speed
      startUtterance(charOffsetRef.current);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (isPlaying) {
      startUtterance(charOffsetRef.current);
    }
  };

  const stop = () => {
    synthRef.current.cancel();
    setIsPlaying(false);
    setHighlightIndex({ start: -1, length: 0 });
    charOffsetRef.current = 0;
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