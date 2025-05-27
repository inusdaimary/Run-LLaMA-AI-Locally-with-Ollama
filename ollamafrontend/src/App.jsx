import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const inputPrompt = prompt;
    const userMessage = { type: 'user', text: inputPrompt };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/ask', { prompt: inputPrompt });
      const botText = response.data.reply;

      let index = 0;
      let currentText = '';


      setMessages((prev) => [...prev, { type: 'bot', text: '' }]);

      const typingInterval = setInterval(() => {
        if (index < botText.length) {
          currentText += botText[index];

          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (updated[lastIndex].type === 'bot') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                text: currentText
              };
            }

            return updated;
          });

          index++;
        } else {
          clearInterval(typingInterval);
          setLoading(false);
        }
      }, 30);
    } catch (error) {
      const errorMessage = { type: 'bot', text: 'Error: ' + error.message };
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };



  return (
    <div className="chat-container">
      <h2>LLaMA 2 Chat Inus</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.type === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question here..."
          rows={2}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;

