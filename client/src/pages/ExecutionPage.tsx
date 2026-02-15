import React from 'react'
import { execute } from '../api/tasks';

const ExecutionPage = () => {
  const handleSubmit=async ()=>{
    console.log("sub");
    await execute();    
  }
  return (
    <button onClick={handleSubmit}>Run</button>
  )
}

export default ExecutionPage