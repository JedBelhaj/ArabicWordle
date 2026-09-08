import Chat from "../components/Chat";
import Game from "../components/Game";
import WaitingRoom from "../components/WaitingRoom";
import Players from "../components/Players";
import RoundEndScreen from "../components/RoundEndScreen";
import GameOverScreen from "../components/GameOverScreen";
import { useEffect, useState } from "react";
import { socket, getSessionId } from "../socket";
import { useNavigate, useParams } from "react-router";

function Multiplayer() {
  const roomId = useParams().roomId;
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const [phase, setPhase] = useState("loading"); // loading | error | lobby | playing | roundEnd | gameEnd
  const [players, setPlayers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [roundInfo, setRoundInfo] = useState(null);
  const [roundEndInfo, setRoundEndInfo] = useState(null);
  const [gameOverInfo, setGameOverInfo] = useState(null);
  const [progress, setProgress] = useState({});
  const [messages, setMessages] = useState([]);
  const [myGuesses, setMyGuesses] = useState([]);
  const [myFinished, setMyFinished] = useState(false);
  const [myWon, setMyWon] = useState(false);

  useEffect(() => {
    socket.emit("room:details", { roomId }, (res) => {
      if (!res.success) {
        setPhase("error");
        return;
      }
      const room = res.room;
      setPlayers(room.players);
      setSettings(room.settings);

      // Rehydrate mid-game state on (re)connect — e.g. after a page refresh —
      // so we land back on the right screen instead of a blank board.
      if (room.round) setRoundInfo(room.round);
      if (room.progress) setProgress(room.progress);
      if (room.myGuesses) setMyGuesses(room.myGuesses);
      setMyFinished(room.myFinished ?? false);
      setMyWon(room.myWon ?? false);
      if (room.roundEndInfo) setRoundEndInfo(room.roundEndInfo);
      if (room.gameOverInfo) setGameOverInfo(room.gameOverInfo);

      setPhase(room.status);
    });

    const onRoomUpdate = ({ players }) => setPlayers(players);
    const onSettings = (newSettings) => setSettings(newSettings);
    const onRoundStart = (info) => {
      setRoundInfo(info);
      setRoundEndInfo(null);
      setProgress({});
      setMyGuesses([]);
      setMyFinished(false);
      setMyWon(false);
      setPhase("playing");
    };
    const onProgress = (payload) => {
      setProgress((prev) => ({
        ...prev,
        [payload.sessionId]: {
          ...payload,
          history: [...(prev[payload.sessionId]?.history ?? []), payload.lastStates],
        },
      }));
    };
    const onRoundEnd = (info) => {
      setRoundEndInfo(info);
      setPhase("roundEnd");
    };
    const onGameOver = (info) => {
      setGameOverInfo(info);
      setPhase("gameEnd");
    };
    const onChatMessage = (msg) => setMessages((prev) => [...prev, msg]);

    socket.on("room:update", onRoomUpdate);
    socket.on("room:settings", onSettings);
    socket.on("game:roundStart", onRoundStart);
    socket.on("game:progress", onProgress);
    socket.on("game:roundEnd", onRoundEnd);
    socket.on("game:over", onGameOver);
    socket.on("chat:message", onChatMessage);

    return () => {
      socket.off("room:update", onRoomUpdate);
      socket.off("room:settings", onSettings);
      socket.off("game:roundStart", onRoundStart);
      socket.off("game:progress", onProgress);
      socket.off("game:roundEnd", onRoundEnd);
      socket.off("game:over", onGameOver);
      socket.off("chat:message", onChatMessage);
    };
  }, [roomId]);

  const handleLeave = () => {
    socket.emit("room:leave", { roomId });
    navigate("/");
  };

  const handleStart = (ack) => {
    socket.emit("room:start", { roomId }, ack);
  };

  const handleUpdateSettings = (patch, ack) => {
    socket.emit("room:updateSettings", { roomId, settings: patch }, ack);
  };

  const handleGuess = (guess) =>
    new Promise((resolve) => {
      socket.emit("game:guess", { roomId, guess }, resolve);
    });

  // Derived from the live players list (not a separately-tracked host id) so
  // a host promotion — e.g. the previous host leaving — takes effect the
  // moment room:update arrives, instead of waiting for a page refresh.
  const isHost = players.find((p) => p.sessionId === sessionId)?.isHost ?? false;

  let boardContent = null;
  if (phase === "loading") {
    boardContent = <div className="text-white text-xl">Loading room…</div>;
  } else if (phase === "error") {
    boardContent = (
      <div className="text-white text-xl flex flex-col items-center gap-4">
        Room not found.
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 px-4 py-2 rounded-lg"
        >
          Back home
        </button>
      </div>
    );
  } else if (phase === "lobby") {
    boardContent = (
      <WaitingRoom
        roomId={roomId}
        players={players}
        settings={settings}
        isHost={isHost}
        onStart={handleStart}
        onUpdateSettings={handleUpdateSettings}
      />
    );
  } else if (phase === "playing" && roundInfo) {
    boardContent = (
      <Game
        key={roundInfo.roundIndex}
        multiplayer={{
          language: roundInfo.language,
          wordLength: roundInfo.wordLength,
          tries: roundInfo.tries,
          timeLimit: roundInfo.timeLimit,
          startedAt: roundInfo.startedAt,
          roundIndex: roundInfo.roundIndex,
          totalRounds: roundInfo.totalRounds,
          onGuess: handleGuess,
          initialGuesses: myGuesses,
          initialFinished: myFinished,
          initialWon: myWon,
        }}
      />
    );
  } else if (phase === "roundEnd" && roundEndInfo) {
    boardContent = <RoundEndScreen roundEndInfo={roundEndInfo} players={players} />;
  } else if (phase === "gameEnd" && gameOverInfo) {
    boardContent = (
      <GameOverScreen
        gameOverInfo={gameOverInfo}
        players={players}
        isHost={isHost}
        onPlayAgain={handleStart}
        onLeave={handleLeave}
      />
    );
  }

  return (
    <div className="dark:bg-neutral-900 w-screen min-h-screen bg-neutral-100 flex">
      <div className="w-3/4 h-screen bg-neutral-800 flex items-center justify-center flex-col relative overflow-y-auto">
        <button
          onClick={handleLeave}
          className="absolute top-4 left-4 text-sm text-gray-400 hover:text-white"
        >
          ← Leave room
        </button>
        {boardContent}
      </div>
      <div className="w-1/4 h-screen border-l border-neutral-700 flex flex-col">
        <div className="h-1/2 max-h-1/2 bg-neutral-900 overflow-y-auto border-b border-neutral-700">
          <Players
            players={players}
            progress={progress}
            tries={roundInfo?.tries ?? settings?.tries ?? 6}
            sessionId={sessionId}
          />
        </div>
        <div className="h-1/2 bg-neutral-900">
          <Chat roomId={roomId} messages={messages} sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}

export default Multiplayer;
