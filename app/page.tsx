"use client"
import { useState } from 'react'
import data from './config.json'

interface Question {
  id?: string;
  question: string;
  answers: Answer[];
}

interface Answer {
  answer: string;
  next: Question | string;
}

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(data);

  function findObjectById(id: string, obj: Question): Question | null {
    if (obj.id === id) {
      return obj;
    }
    if (obj.answers) {
      for (let i = 0; i < obj.answers.length; i++) {
        const result = findObjectById(id, obj.answers[i].next as Question);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  function handleAnswer(answer: string) {
    const nextQuestion = currentQuestion.answers.find((a: { answer: string; }) => a.answer === answer)?.next;
    if (typeof nextQuestion === 'string' && nextQuestion === "done") {
      setCurrentQuestion(data);
    } else if (nextQuestion) {
      const nextQuestionData = typeof nextQuestion === 'string' ? findObjectById(nextQuestion, data) : nextQuestion;
      if (nextQuestionData)
        setCurrentQuestion(nextQuestionData);
      else
        console.error('Could not find next question');
    }
  }
  
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Candara, Optima, Helvetica, Roboto, sans-serif',
      fontWeight: 'bold',
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '2rem',
        textAlign: 'left',
        margin: '2rem',
        width: '60%'
      }} className='question'>{currentQuestion.question}</h1>
      <div>
        {currentQuestion.answers.map((a: { answer: string; }) => (
        <button
          style={{
            color: 'black',
            backgroundColor: 'white',
            border: 'none',
            padding: '1rem',
            margin: '1rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
          className='answer-button'
          onClick={() => handleAnswer(a.answer)}
          key={a.answer}
        >{a.answer}</button>
        ))}
      </div>
    </main>
  )
}
