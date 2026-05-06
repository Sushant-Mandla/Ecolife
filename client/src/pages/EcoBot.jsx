import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Mic, Square, Paperclip, Send, X } from "lucide-react";

const EcoBot = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || "";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ai/history`, {
          headers: { "x-user-id": userId },
        });

        const restored = (res.data || []).flatMap((entry) => {
          const list = [];

          if (entry.userMessage) {
            const displayParts = [entry.userMessage];
            if (entry.attachment?.summary) {
              displayParts.push(entry.attachment.summary);
            }

            list.push({
              role: "user",
              content: displayParts.filter(Boolean).join("\n"),
            });
          }

          if (entry.botReply) {
            list.push({ role: "bot", content: entry.botReply });
          }

          return list;
        });

        setMessages(restored);
      } catch (error) {
        // Keep UI functional even if history is unavailable.
      }
    };

    loadHistory();
  }, [userId]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop?.();
      }
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    };
  }, [attachment]);

  const buildAttachmentSummary = () => {
    if (!attachment) return "";

    if (attachment.kind === "image") {
      return `Attached image: ${attachment.name}.`;
    }

    if (attachment.kind === "text") {
      return `Attached text file: ${attachment.name}. File content snippet: ${attachment.textContent || ""}`;
    }

    return `Attached file: ${attachment.name}.`;
  };

  const handleAttachmentChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError("");

    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }

    const isImage = file.type.startsWith("image/");
    const isText = file.type.startsWith("text/") || file.name.match(/\.(txt|md|csv|json)$/i);
    const previewUrl = isImage ? URL.createObjectURL(file) : "";

    let textContent = "";
    if (isText) {
      textContent = await file.text();
      textContent = textContent.slice(0, 1500);
    }

    setAttachment({
      name: file.name,
      type: file.type,
      kind: isImage ? "image" : isText ? "text" : "file",
      previewUrl,
      textContent,
      file,
    });

    event.target.value = "";
  };

  const clearAttachment = () => {
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    setAttachment(null);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFileError("Voice input is not supported in this browser.");
      return;
    }

    setFileError("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setFileError("Microphone permission is required for voice input.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInput((prev) => `${prev}${prev ? " " : ""}${transcript}`);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessage = async () => {
    if (!input.trim() && !attachment) return;

    const attachmentSummary = buildAttachmentSummary();
    const displayContent = [input.trim(), attachmentSummary].filter(Boolean).join("\n");

    const userMessage = {
      role: "user",
      content: displayContent,
      attachment,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    const currentAttachment = attachment;
    setAttachment(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`,
        {
          message: input,
          attachmentSummary,
          attachmentName: currentAttachment?.name || "",
          attachmentType: currentAttachment?.type || "",
          attachmentText: currentAttachment?.textContent || "",
        },
        {
          headers: userId ? { "x-user-id": userId } : {},
        }
      );

      const botMessage = {
        role: "bot",
        content: res.data.reply,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "bot", content: "⚠️ Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex flex-col flex-1 min-h-0 overflow-hidden text-gray-900"
      style={{
        backgroundColor: "#efeae2",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }}
    >

      {/* HEADER */}
      <div className="bg-white/85 backdrop-blur-md border-b border-black/5 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-green-700">
          🌱 EcoBot AI
        </h1>
        <span className="text-sm text-gray-500">
          Your Sustainability Assistant
        </span>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl px-4 py-3 rounded-3xl shadow-lg border ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white border-emerald-500/40"
                  : "bg-white/95 text-gray-900 border-white/60"
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

              {msg.attachment?.kind === "image" && msg.attachment.previewUrl && (
                <img
                  src={msg.attachment.previewUrl}
                  alt={msg.attachment.name}
                  className="mt-3 max-h-56 rounded-2xl object-cover border border-white/20"
                />
              )}

              {msg.attachment?.kind === "file" && (
                <div className="mt-3 text-sm opacity-90">
                  📎 {msg.attachment.name}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/95 text-gray-900 border px-4 py-3 rounded-2xl shadow-sm animate-pulse">
              EcoBot is typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="sticky bottom-0 z-10 bg-white/85 backdrop-blur-md border-t border-black/5 px-4 md:px-6 pt-4 pb-6 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] space-y-3 text-gray-900 shadow-[0_-1px_0_rgba(0,0,0,0.04)]">
        {fileError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {fileError}
          </div>
        )}

        {attachment && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
            <div className="min-w-0">
              <p className="font-semibold truncate">{attachment.name}</p>
              <p className="text-gray-500 capitalize">{attachment.kind} attachment</p>
            </div>
            <button
              type="button"
              onClick={clearAttachment}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Remove attachment"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.txt,.md,.csv,.json,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleAttachmentChange}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Paperclip className="h-4 w-4" />
            <span className="hidden sm:inline">File</span>
          </button>

          <button
            type="button"
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span className="hidden sm:inline">{isListening ? "Stop" : "Mic"}</span>
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about sustainability..."
            className="flex-1 min-w-0 rounded-full border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="inline-flex items-center gap-2 rounded-full bg-green-700 px-3 py-2 font-semibold text-white hover:bg-green-800 transition shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcoBot;