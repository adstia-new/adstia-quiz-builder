import React from 'react';
import './AgentOnlineStatus.css';

const AgentOnlineStatus = ({ agentName }) => {
  return (
    <div className="agent-online-status">
      <div className="online-indicator"></div>
      <span className="agent-status">{`${agentName} is online`}</span>
    </div>
  );
};

export default AgentOnlineStatus;
