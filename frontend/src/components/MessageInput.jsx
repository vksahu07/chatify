import { useRef, useState, useCallback } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, SmileIcon } from "lucide-react";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "😭",
  "😤",
  "🤔",
  "😴",
  "🥳",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "✅",
  "🙏",
  "💯",
  "🎉",
  "😮",
  "🤣",
  "😢",
  "😡",
  "🤗",
  "😏",
  "🥺",
  "😇",
  "🤩",
  "😬",
  "🙄",
  "😑",
  "👋",
  "✌️",
  "🤝",
  "💪",
  "🫡",
  "👏",
  "🙌",
  "🤞",
  "💀",
  "🫶",
];

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const {
    sendMessage,
    isSoundEnabled,
    selectedUser,
    emitTyping,
    emitStopTyping,
  } = useChatStore();

  const handleTyping = useCallback(
    (value) => {
      setText(value);
      if (isSoundEnabled) playRandomKeyStrokeSound();
      if (!selectedUser) return;
      emitTyping(selectedUser._id);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(selectedUser._id);
      }, 1500);
    },
    [
      isSoundEnabled,
      playRandomKeyStrokeSound,
      selectedUser,
      emitTyping,
      emitStopTyping,
    ],
  );

  const handleSend = () => {
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    emitStopTyping(selectedUser._id);
    clearTimeout(typingTimeoutRef.current);
    sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview(null);
    setShowEmojis(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    inputRef.current?.focus();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-slate-700/50 bg-slate-800/60 px-4 py-3 flex-shrink-0">
      {imagePreview && (
        <div className="mb-3">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-xl border border-slate-600"
            />
            <button
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-slate-200 hover:bg-slate-500"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {showEmojis && (
        <div className="mb-2 bg-slate-700/80 rounded-2xl p-3 border border-slate-600/50">
          <div className="grid grid-cols-10 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-slate-600/50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojis((v) => !v)}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            showEmojis
              ? "text-cyan-400 bg-cyan-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          <SmileIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            imagePreview
              ? "text-cyan-400 bg-cyan-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full py-2.5 px-4 text-slate-200 text-sm placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() && !imagePreview}
          className="w-10 h-10 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
        >
          <SendIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
export default MessageInput;
