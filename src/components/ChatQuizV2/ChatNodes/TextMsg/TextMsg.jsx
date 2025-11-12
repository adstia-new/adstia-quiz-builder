import React, { useEffect, useState } from 'react';
import './TextMsg.css';
import { trackPhoneButtonClick } from '../../utils/trackPhoneButtonClick';

const TextMsg = ({ role = 'agent', text, timer, type }) => {
  const initialMinutes = timer
    ? Math.floor(timer / 60)
        ?.toString()
        ?.padStart(2, '0')
    : '';
  const initialSeconds = timer ? (timer % 60)?.toString()?.padStart(2, '0') : '';
  const [timeLeft, setTimeLeft] = useState(`${initialMinutes}:${initialSeconds}`);
  const splittedText = timer ? text?.split('[[timer]]') : '';

  const handlePhoneClick = (e) => {
    const phoneHref = e.currentTarget.href || '';
    const phoneNumber = phoneHref.replace(/[^\d]/g, '').slice(-10);
    trackPhoneButtonClick(phoneNumber);
  };

  useEffect(() => {
    if (timer) {
      let totalTimeLeftInSeconds = timer;

      const intervalId = setInterval(() => {
        // Decrease the timer every second
        totalTimeLeftInSeconds = totalTimeLeftInSeconds - 1;

        const minutesLeft = Math.floor(totalTimeLeftInSeconds / 60);
        const secondsLeft = totalTimeLeftInSeconds % 60;

        setTimeLeft(
          `${minutesLeft?.toString()?.padStart(2, '0')}:${secondsLeft?.toString()?.padStart(2, '0')}`
        );

        // Stop the timer when it reaches to 0.
        if (totalTimeLeftInSeconds <= 0) {
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div className={role === 'agent' ? 'chat-quiz__message--agent' : 'chat-quiz__message--user'}>
      {timer ? (
        <p>
          {splittedText[0]}
          <span className="timer">{timeLeft}</span>
          {splittedText[1]}
        </p>
      ) : type === 'ringba' ? (
        <a href={`tel:+1${text?.replace(/[^\d]/g, '')?.slice(-10)}`} onClick={handlePhoneClick}>
          {text}
        </a>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default TextMsg;
