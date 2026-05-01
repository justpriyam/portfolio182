'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export function useTypewriter(
  words: string[],
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 2000
): string {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const tick = useCallback(() => {
    const fullText = words[currentWord];

    if (!isDeleting) {
      if (displayText.length < fullText.length) {
        setDisplayText(fullText.slice(0, displayText.length + 1));
        timeoutRef.current = setTimeout(tick, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          tick();
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(fullText.slice(0, displayText.length - 1));
        timeoutRef.current = setTimeout(tick, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWord((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentWord, displayText, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, 100);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tick]);

  return displayText;
}
