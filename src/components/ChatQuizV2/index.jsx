import React, { useEffect, useState } from 'react';
import AgentOnlineStatus from './components/AgentOnlineStatus';
import LoadingMsg from './ChatNodes/LoadingMsg/LoadingMsg';
import TextMsg from './ChatNodes/TextMsg/TextMsg';

const ChatQuizV2 = ({ json }) => {
  const { chats, config } = json;
  const [showLoadingMsg, setShowLoadingMsg] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <AgentOnlineStatus agentName={config.agent.name} />
      <LoadingMsg />
      <TextMsg />
    </>
  );
};

export { ChatQuizV2 };
