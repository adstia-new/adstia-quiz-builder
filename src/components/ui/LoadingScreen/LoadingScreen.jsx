import React from 'react';
import LoadingImg from '/public/loader.svg';
import { createPortal } from 'react-dom';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return createPortal(
    <div className="quiz-builder__loading">
      <LoadingImg className="quiz-builder__spinner" />
    </div>,
    document.body
  );
};

export default LoadingScreen;
