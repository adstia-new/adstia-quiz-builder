import React, { useEffect, useRef, useState } from 'react';
import AgentOnlineStatus from './components/AgentOnlineStatus';
import LoadingMsg from './ChatNodes/LoadingMsg/LoadingMsg';
import TextMsg from './ChatNodes/TextMsg/TextMsg';
import CtaButton from './ChatNodes/CtaButton/CtaButton';
// import { createRoot } from 'react-dom/client';

const ChatQuizV2 = ({ json }) => {
  const { chats, config } = json;
  const [showLoadingMsg, setShowLoadingMsg] = useState(false);
  const [isAgentMsg, setIsAgentMsg] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChat, setCurrentChat] = useState([]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleInsertElm = (currentChat) => {
    if (currentChat?.button?.type === 'cta') {
      // Insert a cta button
      setCurrentChat((prev) => [
        ...prev,
        <CtaButton text={currentChat?.button?.text} handleNext={handleNext} />,
      ]);
    } else if (currentChat?.text) {
      // Insert Simple Text Message for user as well as for agent
      setCurrentChat((prev) => [
        ...prev,
        <TextMsg role={currentChat?.role} text={currentChat?.text} />,
      ]);

      handleNext();
    }
  };

  useEffect(() => {
    if (currentIndex < chats.length) {
      const currentChat = chats[currentIndex];
      const interval = currentChat.messageTimeInterval || config.messageTimeInterval || 1000;

      if (currentChat?.role?.toLowerCase() === 'user') {
        setIsAgentMsg(false);
      } else {
        setIsAgentMsg(true);
      }

      setShowLoadingMsg(true);

      const timer = setTimeout(() => {
        handleInsertElm(currentChat);
        setShowLoadingMsg(false);
      }, interval);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, chats, config.messageTimeInterval]);

  return (
    <div>
      <AgentOnlineStatus agentName={config.agent.name} />

      {currentChat}

      {showLoadingMsg && (
        <div className={isAgentMsg ? 'chat-quiz__message--agent' : 'chat-quiz__message--user'}>
          <LoadingMsg />
        </div>
      )}
    </div>
  );
};

export { ChatQuizV2 };
