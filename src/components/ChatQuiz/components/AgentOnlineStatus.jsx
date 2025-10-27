import React from 'react';
import './AgentOnlineStatus.css';

const AgentOnlineStatus = ({ agentName }) => {
  return (
    <div className="chat-quiz__agent-status">
      <div className="chat-quiz__status-indicator"></div>
      <span className="chat-quiz__status-text">{`${agentName} is online`}</span>
    </div>
  );
};

export default AgentOnlineStatus;
