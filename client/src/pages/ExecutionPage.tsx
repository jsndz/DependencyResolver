

const ExecutionPage = () => {
  const handleSubmit=async ()=>{
    console.log("sub");
    const eventSource = new EventSource("http://localhost:3000/api/execute");

    eventSource.onmessage = (event) => {
      console.log("New data:", event.data);
    };
  
    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
    };
       
  }
  return (
    <button onClick={handleSubmit}>Run</button>
  )
}

export default ExecutionPage