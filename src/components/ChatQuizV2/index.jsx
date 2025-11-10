import React, { useEffect, useState } from 'react';
import AgentOnlineStatus from './components/AgentOnlineStatus';
import LoadingMsg from './ChatNodes/LoadingMsg/LoadingMsg';
import TextMsg from './ChatNodes/TextMsg/TextMsg';
import CtaButton from './ChatNodes/CtaButton/CtaButton';
import InputNode from './ChatNodes/InputNode/InputNode';
import DobNode from './ChatNodes/DobNode/DobNode';
import ZipcodeNode from './ChatNodes/ZipcodeNode/ZipcodeNode';
import OptionsNode from './ChatNodes/OptionsNode/OptionsNode';
import RingbaBtn from './ChatNodes/RingbaBtn/RingbaBtn';

const ChatQuizV2 = ({ json }) => {
  const { chats, config } = json;
  const [showLoadingMsg, setShowLoadingMsg] = useState(false);
  const [isAgentMsg, setIsAgentMsg] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChat, setCurrentChat] = useState([]);

  const handleNext = (newElm, removeLastElm) => {
    if (removeLastElm) {
      setCurrentChat((prev) => [...prev.slice(0, [prev.length - 1])]);
    }
    if (newElm) {
      setCurrentChat((prev) => [...prev, newElm]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleInsertElm = (currentChat) => {
    if (currentChat?.button?.type?.toLowerCase() === 'cta') {
      // Insert a cta button
      setCurrentChat((prev) => [
        ...prev,
        <CtaButton key={currentIndex} text={currentChat?.button?.text} handleNext={handleNext} />,
      ]);
    } else if (currentChat?.button?.type?.toLowerCase() === 'ringba') {
      setCurrentChat((prev) => [
        ...prev,
        <RingbaBtn text={currentChat?.button?.text} href={currentChat?.button?.href} />,
      ]);
    } else if (currentChat?.optionsData) {
      setCurrentChat((prev) => [
        ...prev,
        <OptionsNode optionsData={currentChat?.optionsData} handleNext={handleNext} />,
      ]);
    } else if (currentChat?.input) {
      const input = currentChat?.input;

      if (input?.name?.toLowerCase() === 'age') {
        setCurrentChat((prev) => [
          ...prev,
          <DobNode
            key={currentIndex}
            id={input?.id}
            name={input?.name}
            placeholder={input?.placeholder}
            buttonText={input?.buttonText}
            handleNext={handleNext}
          />,
        ]);
      } else if (input?.name?.toLowerCase() === 'zipcode') {
        setCurrentChat((prev) => [
          ...prev,
          <ZipcodeNode
            key={currentIndex}
            id={input?.id}
            name={input?.name}
            placeholder={input?.placeholder}
            buttonText={input?.buttonText}
            handleNext={handleNext}
          />,
        ]);
      } else {
        setCurrentChat((prev) => [
          ...prev,
          <InputNode
            key={currentIndex}
            id={input?.id}
            name={input?.name}
            placeholder={input?.placeholder}
            buttonText={input?.buttonText}
            handleNext={handleNext}
          />,
        ]);
      }
    } else if (currentChat?.text) {
      // Insert Simple Text Message for user as well as for agent
      setCurrentChat((prev) => [
        ...prev,
        <TextMsg
          key={currentIndex}
          role={currentChat?.role}
          text={currentChat?.text}
          timer={currentChat?.timer?.count}
          type={currentChat?.type}
        />,
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
