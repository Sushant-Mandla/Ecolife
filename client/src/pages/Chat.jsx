import { useEffect, useState, useContext, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MessageBubble from "../components/chat/MessageBubble";
import { Mic, Square, Paperclip, Send } from "lucide-react";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/messages")
      .then(res => setMessages(res.data));

    if (user?.id) {
      socket.emit("userOnline", user.id);
    }

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("reactionUpdated", (updated) => {
      setMessages(prev =>
        prev.map(m => m._id === updated._id ? updated : m)
      );
    });

    socket.on("onlineUsers", setOnlineUsers);

    socket.on("typing", (name) => {
      setTypingUser(name);
      setTimeout(() => setTypingUser(null), 2000);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("reactionUpdated");
      socket.off("onlineUsers");
      socket.off("typing");
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user?.id) return;

    socket.emit("sendMessage", {
      userId: user.id,
      userName: user.name,
      text: text.trim(),
    });

    setText("");
  };

  const sendMediaMessage = (payload) => {
    if (!user?.id) return;

    socket.emit("sendMessage", {
      userId: user.id,
      userName: user.name,
      text: payload.text || "",
      fileUrl: payload.fileUrl || "",
      fileName: payload.fileName || "",
      audioUrl: payload.audioUrl || "",
    });
  };

  const uploadFile = async (file) => {
    if (!file) return;

    setFileError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/messages/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      sendMediaMessage({
        text,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName,
      });
      setText("");
    } catch (error) {
      setFileError(error.response?.data?.error || "File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const startRecording = async () => {
    setFileError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        await uploadAudio(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
    } catch (error) {
      setFileError("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const uploadAudio = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/messages/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      sendMediaMessage({
        text,
        audioUrl: res.data.fileUrl,
        fileName: res.data.fileName,
      });
      setText("");
    } catch (error) {
      setFileError(error.response?.data?.error || "Audio upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleMicClick = async () => {
    if (uploading) return;

    if (isRecording) {
      stopRecording();
      return;
    }

    await startRecording();
  };

  const toggleSelect = (id) => {
    setSelectedMessages(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const deleteMessage = async (id) => {
    if (!user?.id) return;
    await axios.put(
      `http://localhost:5000/api/messages/delete/${id}`,
      { userId: user.id }
    );

    setMessages(prev =>
      prev.map(m =>
        m._id === id
          ? { ...m, deletedFor: [...(m.deletedFor || []), user.id] }
          : m
      )
    );
  };

  const addReaction = (messageId, emoji) => {
    if (!user?.id) return;
    socket.emit("addReaction", {
      messageId,
      reaction: { userId: user.id, emoji }
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col h-screen justify-center items-center" style={{ backgroundColor: "#efeae2" }}>
        <h2 className="text-2xl font-bold text-green-800">Please log in to access the chat</h2>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundColor: "#efeae2",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }}
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {typingUser && (
          <p className="text-sm text-gray-500">
            {typingUser} is typing...
          </p>
        )}

        {messages.map((msg, index) => {
          if (msg.deletedFor?.includes(user?.id)) return null;

          const isOwn = msg.userId === user?.id;

          const currentDate = new Date(msg.createdAt).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;

          const showDate = currentDate !== prevDate;

          return (
            <div key={msg._id}>
              {showDate && (
                <div className="text-center text-gray-500 my-3">
                  {currentDate}
                </div>
              )}

              <MessageBubble
                msg={msg}
                isOwn={isOwn}
                canDelete={!!user?.id}
                selected={selectedMessages.includes(msg._id)}
                onSelect={toggleSelect}
                onDelete={deleteMessage}
                onReact={addReaction}
              />

              <div className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right mr-4" : "ml-4"}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 bg-white border-t space-y-3">
        {fileError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {fileError}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
          className="hidden"
          onChange={(e) => uploadFile(e.target.files?.[0])}
        />

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attach
            </span>
          </button>

          <button
            type="button"
            onClick={handleMicClick}
            disabled={uploading}
            className={`px-4 py-2 rounded-full text-white disabled:opacity-60 ${
              isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isRecording ? `Stop (${recordingSeconds}s)` : "Mic"}
            </span>
          </button>

          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              socket.emit("typing", user?.name);
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message or attach media..."
            className="border rounded-full px-4 py-2 flex-1"
          />
          <button
            onClick={sendMessage}
            disabled={uploading}
            className="bg-green-700 text-white px-6 rounded-full disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" />
              {uploading ? "Sending..." : "Send"}
            </span>
          </button>
        </div>
      </div>

      <div className="p-2 bg-gray-200 text-sm">
        🟢 Online Users: {onlineUsers.length}
      </div>
    </div>
  );
};

export default Chat;