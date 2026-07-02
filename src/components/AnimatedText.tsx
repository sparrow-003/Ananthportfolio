import { useState, useEffect, useRef } from 'react';

interface AnimatedTextProps {
  texts: readonly string[];
  interval?: number;
  className?: string;
}

type Phase = 'typing' | 'pause-full' | 'deleting' | 'pause-empty';

const TYPING_SPEED = 55;
const DELETE_SPEED = 28;
const PAUSE_FULL = 1800;
const PAUSE_EMPTY = 400;

const AnimatedText = ({ texts, className = '' }: AnimatedTextProps) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const currentTarget = texts[textIndex];

  useEffect(() => {
    if (phase === 'typing') {
      if (displayText.length < currentTarget.length) {
        timerRef.current = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        timerRef.current = setTimeout(() => setPhase('pause-full'), PAUSE_FULL);
      }
    } else if (phase === 'pause-full') {
      timerRef.current = setTimeout(() => setPhase('deleting'), PAUSE_FULL);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, DELETE_SPEED);
      } else {
        timerRef.current = setTimeout(() => {
          setTextIndex(prev => (prev + 1) % texts.length);
          setPhase('typing');
        }, PAUSE_EMPTY);
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [phase, displayText, currentTarget, texts.length]);

  return (
    <span className={`inline-block ${className}`}>
      {displayText}
      <span className="animate-pulse ml-0.5 font-light opacity-80">|</span>
    </span>
  );
};

export default AnimatedText;
