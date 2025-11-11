import React, { useEffect, useState } from 'react';
import CtaButton from './ChatNodes/CtaButton/CtaButton';
import DobNode from './ChatNodes/DobNode/DobNode';
import InputNode from './ChatNodes/InputNode/InputNode';
import LoadingMsg from './ChatNodes/LoadingMsg/LoadingMsg';
import OptionsNode from './ChatNodes/OptionsNode/OptionsNode';
import RingbaBtn from './ChatNodes/RingbaBtn/RingbaBtn';
import TextMsg from './ChatNodes/TextMsg/TextMsg';
import ZipcodeNode from './ChatNodes/ZipcodeNode/ZipcodeNode';
import AgentOnlineStatus from './components/AgentOnlineStatus';
import './index.css';

const ChatQuizV2 = ({ json }) => {
  const { chats, config } = json;
  const [showLoadingMsg, setShowLoadingMsg] = useState(false);
  const [isAgentMsg, setIsAgentMsg] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChat, setCurrentChat] = useState([]);

  const handleNext = (newElm, removeLastElm) => {
    // Remove last element if removeLastElm is true
    if (removeLastElm) {
      setCurrentChat((prev) => {
        const prevChatObj = prev[prev.length - 1];
        return [
          ...prev.slice(0, prev.length - 1),
          {
            role: prevChatObj?.role,
            chats: prevChatObj?.chats?.slice(0, [prevChatObj?.chats?.length - 1]),
          },
        ];
      });
    }

    // Insert new Chat to their respective chat obj
    if (newElm) {
      setCurrentChat((prev) => {
        const chat = prev[prev.length - 1];
        const isInsertInLastElm = chat?.role === newElm?.props?.role;

        if (isInsertInLastElm) {
          return [
            ...prev.slice(0, prev.length - 1),
            { role: chat?.role, chats: [...prev[prev.length - 1]?.chats, newElm] },
          ];
        }
        return [...prev, { role: newElm?.props?.role, chats: [newElm] }];
      });
    }
    setCurrentIndex((prev) => prev + 1);
  };

  // Function to handle Insertion of element in currentChat
  const handleInsertElm = (chat) => {
    let newChat = {};
    const isInsertInLastElm =
      currentChat?.length > 0 && chat?.role === currentChat[currentChat?.length - 1]?.role;

    if (chat?.button?.type?.toLowerCase() === 'cta') {
      newChat = (
        <CtaButton
          role={chat?.role}
          text={chat?.button?.text}
          handleNext={handleNext}
          ringbaScriptId={config?.ringbaScriptId}
        />
      );
    } else if (chat?.button?.type?.toLowerCase() === 'ringba') {
      newChat = <RingbaBtn role={chat?.role} text={chat?.button?.text} href={chat?.button?.href} />;
    } else if (chat?.optionsData) {
      newChat = (
        <OptionsNode role={chat?.role} optionsData={chat?.optionsData} handleNext={handleNext} />
      );
    } else if (chat?.input) {
      const input = chat?.input;

      if (input?.name?.toLowerCase() === 'age') {
        newChat = (
          <DobNode
            id={input?.id}
            role={chat?.role}
            name={input?.name}
            placeholder={input?.placeholder}
            buttonText={input?.buttonText}
            handleNext={handleNext}
          />
        );
      } else if (input?.name?.toLowerCase() === 'zipcode') {
        newChat = (
          <ZipcodeNode
            id={input?.id}
            role={chat?.role}
            name={input?.name}
            placeholder={input?.placeholder}
            buttonText={input?.buttonText}
            handleNext={handleNext}
          />
        );
      } else {
        newChat = (
          <InputNode
            id={input?.id}
            role={chat?.role}
            name={input?.name}
            placeholder={input?.placeholder}
            buttonText={input?.buttonText}
            handleNext={handleNext}
          />
        );
      }
    } else if (chat?.text) {
      newChat = (
        <TextMsg role={chat?.role} text={chat?.text} timer={chat?.timer?.count} type={chat?.type} />
      );

      setCurrentChat((prev) => {
        if (isInsertInLastElm) {
          return [
            ...prev.slice(0, prev.length - 1),
            { role: chat?.role, chats: [...prev[prev.length - 1]?.chats, newChat] },
          ];
        }
        return [...prev, { role: chat?.role, chats: [newChat] }];
      });

      handleNext();
      return;
    }

    setCurrentChat((prev) => {
      if (isInsertInLastElm) {
        return [
          ...prev.slice(0, prev.length - 1),
          { role: chat?.role, chats: [...prev[prev.length - 1]?.chats, newChat] },
        ];
      }
      return [...prev, { role: chat?.role, chats: [newChat] }];
    });
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

      {currentChat?.length > 0 &&
        currentChat.map((chatObj, chatArrIdx) => {
          if (chatObj?.role === 'agent') {
            return (
              <div
                key={chatArrIdx}
                className="chat-quiz__message--with-profile chat-quiz__message--agent"
              >
                <img
                  className={`chat-quiz__profile-image ${showLoadingMsg ? 'hide_img' : ''}`}
                  src={config?.agent?.profileImage}
                  alt={config.agent?.name}
                />
                <div className="chat-quiz__message-content">
                  {chatObj?.chats.length > 0 &&
                    chatObj?.chats.map((chat, chatIdx) => {
                      return <div key={`${chatArrIdx}_${chatIdx}`}>{chat}</div>;
                    })}
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={chatArrIdx}
                className="chat-quiz__message--with-profile chat-quiz__message--user"
              >
                <img
                  className={`chat-quiz__profile-image`}
                  src={config?.user?.profileImage}
                  alt={config.user?.name}
                />
                <div className="chat-quiz__message-content">
                  {chatObj?.chats.length > 0 &&
                    chatObj?.chats.map((chat, chatIdx) => {
                      return <div key={`${chatArrIdx}_${chatIdx}`}>{chat}</div>;
                    })}
                </div>
              </div>
            );
          }
        })}

      {showLoadingMsg && (
        <div
          className={`chat-quiz__message--with-profile ${isAgentMsg ? 'chat-quiz__message--agent' : 'chat-quiz__message--user'}`}
        >
          <img
            className="chat-quiz__profile-image"
            src={config?.agent?.profileImage}
            alt={config.agent?.name}
          />
          <div className="chat-quiz__message-content">
            <div className={isAgentMsg ? 'chat-quiz__message--agent' : 'chat-quiz__message--user'}>
              <LoadingMsg />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatQuizV2 };
