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
      text: 'Great, let me ask you quick questions',
    },
    {
      role: 'agent',
      text: 'What is your age?',
    },
    {
      role: 'agent',
      input: {
        buttonText: 'Submit',
        name: 'age',
        placeholder: 'Enter your age',
      },
    },
    {
      role: 'agent',
      text: 'Do you have Medicare Part A and Part B?',
    },
    {
      role: 'agent',
      options: {
        name: 'medicarePartAB',
        options: ['Yes', 'No'],
      },
    },
    {
      role: 'agent',
      text: 'What is your zipcode?',
    },
    {
      role: 'agent',
      input: {
        buttonText: 'Submit',
        name: 'zipcode',
        placeholder: 'Enter your zipcode',
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
    {
      role: 'agent',
      text: 'Your spot is being held for 2:00',
    },
    {
      role: 'agent',
      text: '<a href="tel:18002223333">+1 (800) 222 3333</a>',
    },
    {
      role: 'agent',
      button: {
        text: 'Call Now',
        type: 'ringba',
        onClick: () => {
          window.location.href = 'tel:18002223333';
        },
      },
    },
  ],
};

export default chatJson;
