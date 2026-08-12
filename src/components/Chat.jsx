import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

function Chat({ roomId, messages, sessionId }) {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    socket.emit("chat:message", { roomId, text: input });
    setInput("");
  };

  return (
    <div className="p-4 h-full flex flex-col text-white">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className={`font-semibold ${msg.sessionId === sessionId ? "text-indigo-300" : ""}`}>
              {msg.username}:
            </span>{" "}
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border border-neutral-300 rounded bg-neutral-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Chat;
