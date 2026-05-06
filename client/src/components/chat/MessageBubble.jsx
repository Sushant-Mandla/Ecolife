import { useEffect, useRef, useState } from "react";
import { MoreVertical, Info, Reply, Smile, Download, Forward, Pin, Star, Trash2 } from "lucide-react";

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageBubble = ({
  msg,
  isOwn,
  canDelete,
  selected,
  currentUserId,
  onSelect,
  onDelete,
  onReact,
  onInfo,
  onReply,
  onDownload,
  onForward,
  onTogglePin,
  onToggleStar,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const menuRef = useRef(null);

  const isPinnedByMe = (msg.pinnedBy || []).includes(currentUserId);
  const isStarredByMe = (msg.starredBy || []).includes(currentUserId);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="relative pr-8" ref={menuRef}>
        <div
          onClick={() => onSelect(msg._id)}
          className={`p-3 rounded-lg shadow max-w-xs cursor-pointer ${
            isOwn ? "bg-green-600 text-white" : "bg-white"
          } ${selected ? "ring-2 ring-red-500" : ""}`}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold opacity-80">{msg.userName}</p>
            <div className="flex items-center gap-1 text-[10px]">
              {msg.isForwarded && <span className="rounded bg-black/10 px-1 py-0.5">Forwarded</span>}
              {(msg.pinnedBy || []).length > 0 && <span title="Pinned">📌</span>}
              {isStarredByMe && <span title="Starred">⭐</span>}
            </div>
          </div>

          {msg.replyTo?.text && (
            <div className={`mb-2 rounded border-l-4 px-2 py-1 text-xs ${isOwn ? "bg-green-500/40 border-green-200" : "bg-gray-100 border-green-500"}`}>
              <p className="font-semibold">Reply to {msg.replyTo.userName}</p>
              <p className="truncate">{msg.replyTo.text}</p>
            </div>
          )}

          {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

          {msg.fileUrl && (
            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              📎 {msg.fileName || "Attachment"}
            </a>
          )}

          {msg.audioUrl && (
            <audio controls className="mt-2 max-w-full">
              <source src={msg.audioUrl} />
            </audio>
          )}

          {!!msg.reactions?.length && (
            <div className="mt-2 flex flex-wrap gap-1">
              {msg.reactions.map((r, i) => (
                <span key={`${r.userId}-${i}`} className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
                  {r.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
            setShowReactions(false);
          }}
          className="absolute right-0 top-1 rounded-full bg-white p-1.5 text-gray-700 shadow hover:bg-gray-100"
          aria-label="Open message actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-xl">
            {showReactions ? (
              <div className="mb-1 flex flex-wrap gap-1 p-1">
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onReact(msg._id, emoji);
                      setMenuOpen(false);
                      setShowReactions(false);
                    }}
                    className="rounded px-2 py-1 hover:bg-gray-100"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : null}

            <button type="button" onClick={() => onInfo(msg)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100">
              <Info className="h-4 w-4" /> Message info
            </button>
            <button type="button" onClick={() => onReply(msg)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100">
              <Reply className="h-4 w-4" /> Reply
            </button>
            <button
              type="button"
              onClick={() => setShowReactions((prev) => !prev)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100"
            >
              <Smile className="h-4 w-4" /> React
            </button>
            <button type="button" onClick={() => onDownload(msg)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100">
              <Download className="h-4 w-4" /> Download
            </button>
            <button type="button" onClick={() => onForward(msg)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100">
              <Forward className="h-4 w-4" /> Forward
            </button>
            <button
              type="button"
              onClick={() => onTogglePin(msg._id)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100"
            >
              <Pin className="h-4 w-4" /> {isPinnedByMe ? "Unpin" : "Pin"}
            </button>
            <button
              type="button"
              onClick={() => onToggleStar(msg._id)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100"
            >
              <Star className="h-4 w-4" /> {isStarredByMe ? "Unstar" : "Star"}
            </button>
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(msg._id)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> {isOwn ? "Delete" : "Delete for me"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;