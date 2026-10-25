import React, { useState } from 'react';
import { CounterContext } from './counterContext';
export default function CounterContextProvider({children}:{children : React.ReactNode}) {
    const [counter, setCounter] = useState(10)
  return (
    <>
    <CounterContext.Provider value={ {counter , setCounter}}>
        {children}
    </CounterContext.Provider>
    </>
  )
}
