import { DEFAULT_MESSAGE_TIME_INTERVAL } from '../constants';

const chatJson = {
  config: {
    agent: {
      name: 'Mary',
      profileImage: 'https://qualifybenefitsnow.com/media/6571cd02d1175942219431.png',
    },
    user: {
      name: 'User',
      profileImage: 'https://qualifybenefitsnow.com/build/images/avatar.1411bf05.png',
    },
    messageTimeInterval: DEFAULT_MESSAGE_TIME_INTERVAL,
  },
  chats: [
    {
      role: 'agent',
      text: 'Hello 👋',
      messageTimeInterval: 800,
    },
    {
      role: 'agent',
      text: 'I’m {{config.agent.name}}. This will only take a minute.',
      messageTimeInterval: 1200,
    },
    {
      role: 'agent',
      text: 'Want to find out if you qualify to receive a Spending Allowance Card and other benefits? Tap Yes!',
      messageTimeInterval: 600,
    },
    {
      role: 'agent',
      button: {
        text: 'Yes',
        onClick: () => {
          console.log('Yes button clicked');
        },
      },
    },
    {
      role: 'user',
      text: 'Yes',
    },
    {
      role: 'agent',
      text: 'Great, let me ask you two quick questions',
    },
    {
      role: 'agent',
      text: 'What year were you born?',
    },
  ],
};

export default chatJson;
