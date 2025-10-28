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
      text: 'I’m Mary. This will only take a minute.',
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
      text: 'What year were you born?',
    },
    {
      role: 'agent',
      input: {
        id: 1,
        buttonText: 'Submit',
        name: 'age',
        placeholder: 'Year',
        fixedValue: '19',
      },
    },
    {
      role: 'agent',
      text: 'Do you have Medicare Part A and Part B?',
    },
    {
      role: 'agent',
      options: {
        id: 2,
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
        id: 3,
        buttonText: 'Submit',
        isFinalQue: true,
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
      text: 'Your spot is being held for <span style="color:red;">{{timer}}</span>',
      timer: {
        count: 120,
      },
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
        href: 'tel:+18002223333',
      },
    },
  ],
};

export default chatJson;
