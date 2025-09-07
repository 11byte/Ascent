'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(`${parseFloat(newValue.toFixed(7))}`)
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(`${parseFloat(newValue.toFixed(7))}`)
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ]

  const handleClick = (value: string) => {
    if (value === 'C') {
      clear()
    } else if (value === '=') {
      performCalculation()
    } else if (['+', '-', '×', '÷'].includes(value)) {
      inputOperation(value)
    } else if (value === '.') {
      if (display.indexOf('.') === -1) {
        inputNumber(value)
      }
    } else if (value === '±') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display)
    } else if (value === '%') {
      setDisplay(String(parseFloat(display) / 100))
    } else {
      inputNumber(value)
    }
  }

  return (
    <div className="text-white">
      {/* Display */}
      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <div className="text-right text-3xl font-mono overflow-hidden">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((row, rowIndex) => 
          row.map((button, buttonIndex) => (
            <motion.button
              key={`${rowIndex}-${buttonIndex}`}
              onClick={() => handleClick(button)}
              whileTap={{ scale: 0.95 }}
              className={`h-12 rounded-lg font-semibold text-white transition-colors ${
                button === '0' ? 'col-span-2' : ''
              } ${
                ['+', '-', '×', '÷', '='].includes(button)
                  ? 'bg-orange-500/80 hover:bg-orange-500'
                  : ['C', '±', '%'].includes(button)
                  ? 'bg-gray-500/80 hover:bg-gray-500'
                  : 'bg-gray-700/80 hover:bg-gray-600'
              }`}
            >
              {button}
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}