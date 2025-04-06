import React, { useState, useEffect } from 'react';

const MessageBox = () => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages/get', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setMessages(data.reverse());
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  const sendMessage = async () => {
    if (!msgInput.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: msgInput }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setMsgInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl shadow space-y-4">
      <div className="h-64 overflow-y-auto border p-2 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 p-2 bg-blue-100 rounded">
            <p className="text-sm font-semibold">{msg.senderId?.name || 'Unknown'}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
