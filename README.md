# Adstia Quiz Builder

A React component library for building interactive quiz applications.

## Installation

```bash
npm install adstia-quiz-builder
```

## Usage

```jsx
import { useState } from "react";
import { QuizBuilder } from "adstia-quiz-builder";
import QuizJson from "./quizJson.json";

function QuizPage() {
  const [quizData, setQuizData] = useState(null);
  console.log("Quiz Data:", quizData);

  return (
    <div className="App">
      <QuizBuilder
        setQuizData={setQuizData}
        json={QuizJson}
      />
    </div>
  );
}
```

## Quiz Data Structure Example

Your quiz JSON should follow this structure:

```js
{
  quizName: "Quiz Name",
  totalSteps: 8,
  config: {
    nextButtonText: "Next",
    previousButtonText: "Previous",
    submitButtonText: "Check My Eligibility",
    prefillValues: true
  },
  quizJson: [
    {
      quizCardId: "0",
      question: "What is your marital status?",
      subText: "I wondering if you are married or single?",
      nodes: [
        {
          nodeType: "dropdown", // or "options", "input", "zipcode", "dob", "email", "phone"
          nodeName: "maritalStatus",
          options: [
            { label: "Married", value: "married", next: "1" },
            // ...other options
          ]
        }
      ],
      next: "1"
    },
    {
      quizCardId: "1",
      quizCardType: "start",
      question: "What is your zip code?",
      nodes: [
        {
          nodeType: "zipcode",
          nodeName: "zipcode",
          inputLabel: "Zip Code",
          validation: {
            required: true,
            pattern: "^\\d+$",
            minLength: 5,
            maxLength: 5
          }
        }
      ],
      next: "2"
    },
    // ...more quiz cards
    {
      quizCardId: "10",
      quizCardType: "end",
      nodes: [
        {
          nodeType: "congrats",
          nodeName: "QUALIFIED",
          redirectUrl: "/congrats",
          openInNewTab: false,
          redirectCurrentTab: true,
          redirectCurrentTabUrl: "https://www.youtube.com/"
        }
      ]
    }
  ]
}
```

### Key Properties
- `quizName`: Name of the quiz
- `totalSteps`: Total number of steps/cards
- `config`: Quiz configuration (button texts, prefill, etc.)
- `quizJson`: Array of quiz cards
  - `quizCardId`, `quizCardType`, `question`, `subText`, `nodes`, `next`, `progress`
  - `nodes`: Each node can be of type `input`, `zipcode`, `dob`, `dropdown`, `options`, `email`, `phone`, etc.
  - Validation and navigation handled via `validation` and `next` keys
  - End cards can include redirect logic

## Features

- Interactive quiz components (input, zipcode, options, dropdown, etc.)
- Real-time validation and error handling
- Next button disables automatically on error or required fields
- Easy to integrate with existing React applications
- Customizable and extensible
- **Prefill feature:** If `prefillValues` is enabled in `quizConfig`, previously entered values are automatically loaded from localStorage for supported nodes (input, zipcode, email, phone, dob).
- **Context API:** `quizConfig` is provided via React context for all quiz components.
- **setQuizData prop:** Pass a setter to receive quiz results or state in your parent component.

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
