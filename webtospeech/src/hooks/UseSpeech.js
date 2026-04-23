import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpeech(content, onEnd) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(75);
  const [highlightIndex, setHighlightIndex] = useState({ start: -1, length: 0 });

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const charOffsetRef = useRef(0);

  const speedRef = useRef(speed);
  const volumeRef = useRef(volume);

  useEffect(() => {
    const synth = synthRef.current;
    return () => synth.cancel();
  }, []);

  const startUtterance = useCallback((offset = 0) => {
    const synth = synthRef.current;
    synth.cancel();

    const textToSpeak = content.slice(offset);
    if (!textToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = speedRef.current;
    utterance.volume = volumeRef.current / 100;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        charOffsetRef.current = offset + event.charIndex;
        setHighlightIndex({
          start: offset + event.charIndex,
          length: event.charLength,
        });
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setHighlightIndex({ start: -1, length: 0 });
      charOffsetRef.current = 0;

      onEnd?.();
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [content, onEnd]);

  // Cancel and reset highlight when page content changes
  useEffect(() => {
    const synth = synthRef.current;

    synth.cancel();
    utteranceRef.current = null;
    setHighlightIndex({ start: -1, length: 0 });
    charOffsetRef.current = 0;

    if (wasPlayingRef.current) {
      startUtterance(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [content, startUtterance]);

  const handlePlayPause = useCallback(() => {
    const synth = synthRef.current;

    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
      wasPlayingRef.current = false;
      return;
    }

    startUtterance(charOffsetRef.current);
    setIsPlaying(true);
    wasPlayingRef.current = true;
  }, [isPlaying, startUtterance]);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    volumeRef.current = newVolume;
  };

  const commitSpeechSettings = () => {
    if (!isPlaying) return;
    startUtterance(charOffsetRef.current);
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
    commitSpeechSettings,
    stop,
  };
}