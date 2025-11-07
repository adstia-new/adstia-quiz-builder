import React, { useEffect, useState } from 'react';
import AgentOnlineStatus from './components/AgentOnlineStatus';
import LoadingMsg from './ChatNodes/LoadingMsg/LoadingMsg';
import TextMsg from './ChatNodes/TextMsg/TextMsg';

const ChatQuizV2 = ({ json }) => {
  const { chats, config } = json;
  const [showLoadingMsg, setShowLoadingMsg] = useState(false);
  const [isAgentMsg, setIsAgentMsg] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        setVisibleMessages((prev) => [...prev, currentChat]);
        setShowLoadingMsg(false);
        setCurrentIndex((prev) => prev + 1);
      }, interval);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, chats, config.messageTimeInterval]);

  return (
    <>
      <AgentOnlineStatus agentName={config.agent.name} />
      {visibleMessages.map((chat, index) => {
        if (chat.role === 'agent') {
          // for agent text message
          if (chat.text) {
            return (
              <div className="chat-quiz__message--agent">
                <TextMsg key={index} msg={chat.text} />
              </div>
            );
          }

          return null;
        }

        // for user Text message
        if (chat.text && chat.role === 'user') {
          return (
            <div className="chat-quiz__message--user">
              <TextMsg key={index} msg={chat.text} />
            </div>
          );
        }
      })}
      {showLoadingMsg && (
        <div className={isAgentMsg ? 'chat-quiz__message--agent' : 'chat-quiz__message--user'}>
          <LoadingMsg />
        </div>
      )}
    </>
  );
};

export { ChatQuizV2 };
