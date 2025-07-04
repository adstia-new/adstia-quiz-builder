# Adstia Quiz Builder

A React component library for building interactive quiz applications.

## Installation

```bash
npm install adstia-quiz-builder
```

## Usage

```jsx
import React from 'react';
import { QuizBuilder } from 'adstia-quiz-builder';

const quizJson = [
  // ...your quiz data here (see below for format)
];

function App() {
  return (
    <div>
      <QuizBuilder json={{ quizJson }} />
    </div>
  );
}

export default App;
```

## Quiz Data Format Example

```js
const quizJson = [
  {
    quizCardId: "1",
    question: "What is your zip code?",
    nodes: [
      {
        nodeType: "zipcode",
        nodeName: "WEBSITE_ZIP",
        inputLabel: "Zip Code",
        inputType: "text",
        placeholder: "Enter zipcode",
        inputName: "zipcode",
        validation: {
          required: true,
          pattern: "^\\d{5}$",
          errorMessage: "Invalid Zip Code",
          minLength: 5,
          maxLength: 5
        }
      }
    ],
    next: "2"
  },
  // ...more quiz cards
];
```

## Features

- Interactive quiz components (input, zipcode, options, dropdown, etc.)
- Real-time validation and error handling
- Next button disables automatically on error or required fields
- Easy to integrate with existing React applications
- Customizable and extensible

## Development

To build the package:

```bash
npm run build
```

To develop locally and test in another app:

```bash
npm link
# In your test app:
npm link adstia-quiz-builder
```

## License

ISC
