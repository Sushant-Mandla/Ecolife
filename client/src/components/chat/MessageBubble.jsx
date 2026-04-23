const MessageBubble = ({
  msg,
  isOwn,
  canDelete,
  selected,
  onSelect,
  onDelete,
  onReact,
}) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        onClick={() => onSelect(msg._id)}
        className={`p-3 rounded-lg shadow max-w-xs cursor-pointer ${
          isOwn ? "bg-green-600 text-white" : "bg-white"
        } ${selected ? "ring-2 ring-red-500" : ""}`}
      >
        <p className="text-xs font-semibold mb-1 opacity-80">
        {msg.userName}
</p>

        {msg.text && <p>{msg.text}</p>}

        {msg.fileUrl && (
          <a href={msg.fileUrl} target="_blank" rel="noreferrer">
            📎 {msg.fileName}
          </a>
        )}

        {msg.audioUrl && (
          <audio controls>
            <source src={msg.audioUrl} />
          </audio>
        )}

        <div className="flex gap-2 mt-2">
          {msg.reactions?.map((r, i) => (
            <span key={i}>{r.emoji}</span>
          ))}
        </div>

        <div className="flex justify-between mt-2 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReact(msg._id, "👍");
            }}
          >
            👍
          </button>

          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(msg._id);
              }}
              className="text-red-400"
            >
              {isOwn ? "Delete" : "Delete for me"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;