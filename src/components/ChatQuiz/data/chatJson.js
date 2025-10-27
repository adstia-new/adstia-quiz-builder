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
    {
      role: 'agent',
      input: {
        buttonText: 'confirm',
        name: 'age',
        fixedValue: '19',
      },
    },
    {
      role: 'agent',
      text: 'Do you currently live in Delhi?',
    },
    {
      role: 'agent',
      options: {
        name: 'liveInDelhi',
        options: ['Yes', 'No'],
      },
    },
    {
      role: 'agent',
      text: 'Last question:',
    },
    {
      role: 'agent',
      text: 'Do you take any special medications for a chronic or rare medical condition?',
    },
    {
      role: 'agent',
      text: 'Either way, you can still qualify',
    },
    {
      role: 'agent',
      options: {
        name: 'specialMedications',
        options: ['No', 'Yes'],
      },
    },
    {
      role: 'agent',
      text: '🎉 Congratulations! 🎁',
    },
    {
      role: 'agent',
      text: 'Calculating your benefits...',
    },
    {
      role: 'agent',
      text: 'It looks like you may qualify for a Spending Allowance Card!',
    },
  ],
};

export default chatJson;
