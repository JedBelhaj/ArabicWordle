import React, { useRef, useEffect, useState } from "react";

function Chat() {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, user: "Ali", text: "مرحبا! كيف حالك؟" },
    { id: 2, user: "Sara", text: "أنا بخير، شكرا! وأنت؟" },
    { id: 3, user: "Ali", text: "أنا أيضا بخير." },
    { id: 4, user: "Sara", text: "هل تريد أن تلعب ووردل؟" },
    { id: 5, user: "Ali", text: "نعم، فكرة رائعة!" },
    { id: 6, user: "Sara", text: "هيا نبدأ الجولة الأولى!" },
    { id: 7, user: "Ali", text: "ما هي الكلمة الأولى؟" },
    { id: 8, user: "Sara", text: "لن أخبرك! عليك أن تخمن." },
    { id: 9, user: "Ali", text: "حسنًا، سأحاول." },
    { id: 10, user: "Sara", text: "ابدأ بالتخمين!" },
    { id: 11, user: "Ali", text: "هل هي كلمة من خمسة أحرف؟" },
    { id: 12, user: "Sara", text: "نعم، بالضبط." },
    { id: 13, user: "Ali", text: "حسنا، تخميني الأول: كتاب." },
    { id: 14, user: "Sara", text: "قريب، لكن ليست الكلمة الصحيحة." },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          user: prevMessages.length % 2 === 0 ? "Ali" : "Sara",
          text: `رسالة جديدة رقم ${prevMessages.length + 1}`,
        },
      ]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        user: "User", // You can change this to the current user
        text: input,
      },
    ]);
    setInput("");
  };

  return (
    <div className="p-4 h-full flex flex-col text-white">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">{msg.user}:</span> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="اكتب رسالة..."
          className="w-full p-2 border border-neutral-300 rounded bg-neutral-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Chat;
