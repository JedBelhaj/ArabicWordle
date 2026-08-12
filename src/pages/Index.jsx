import { useNavigate } from "react-router";
import RainDropEffect from "../components/effects/RainDropEffect";
import { socket } from "../socket";
import { useState } from "react";

function Index() {
  // State management
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Utility functions
  const clearError = () => setError("");
  
  const validateInput = (username, roomIdRequired = false) => {
    if (!username.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (roomIdRequired && !roomId.trim()) {
      setError("Please enter a room ID to join");
      return false;
    }
    return true;
  };

  // Event handlers
  const handleCreateRoom = () => {
    const username = name || "Guest";
    
    if (!validateInput(username)) return;
    
    clearError();
    setIsLoading(true);
    
    socket.emit(
      "room:create",
      { username },
      ({ roomId, sessionId, success, message }) => {
        setIsLoading(false);
        
        if (success !== false) {
          localStorage.setItem("sessionId", sessionId);
          console.log("Room created with ID:", roomId);
          navigate(`/multiplayer/${roomId}`);
        } else {
          setError(message || "Failed to create room. Please try again.");
        }
      },
    );
  };

  const handleJoinRoom = () => {
    const username = name || "Guest";
    
    if (!validateInput(username, true)) return;
    
    clearError();
    setIsLoading(true);
    
    socket.emit(
      "room:join",
      { roomId: roomId.trim(), username },
      ({ success, roomId: joinedRoomId, sessionId, message }) => {
        setIsLoading(false);
        
        if (success) {
          localStorage.setItem("sessionId", sessionId);
          console.log("Joined room with ID:", joinedRoomId);
          navigate(`/multiplayer/${joinedRoomId}`);
        } else {
          setError(message || "Failed to join room. Please check the room ID and try again.");
        }
      },
    );
  };

  const handleSinglePlayer = () => {
    navigate("/singleplayer");
  };

  // Input handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) clearError();
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
    if (error) clearError();
  };

  return (
    <div className="bg-gradient-to-t from-slate-900 to-zinc-900 w-screen min-h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center items-center z-10">
        <h1 className="text-white text-5xl font-bold">
          Welcome to Wordle Multiplayer!
        </h1>
        
        {/* Input Section */}
        <div className="flex flex-col items-center mt-5 gap-3">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            className="p-3 rounded-lg bg-slate-900 text-white font-semibold placeholder:font-normal placeholder:text-gray-500"
            onChange={handleNameChange}
            disabled={isLoading}
          />
          
          <input
            type="text"
            placeholder="Room ID (optional - for joining)"
            value={roomId}
            className="p-3 rounded-lg bg-slate-900 text-white font-semibold placeholder:font-normal placeholder:text-gray-500"
            onChange={handleRoomIdChange}
            disabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-600 text-white rounded-lg font-semibold">
            {error}
          </div>
        )}

        {/* Buttons Section */}
        <div className="m-10 gap-5 flex flex-wrap justify-center">
          <button
            onClick={handleSinglePlayer}
            disabled={isLoading}
            className="bg-green-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Single Player
          </button>
          
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="bg-yellow-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Creating..." : "Create Room"}
          </button>
          
          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
            className="bg-blue-400 p-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Joining..." : "Join Room"}
          </button>
        </div>
      </div>

      <RainDropEffect letterCount={100} />
    </div>
  );
}

export default Index;
