import { LockIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const QUICK_MESSAGES = [
  "👋 Say Hello",
  "🤝 How are you?",
  "📅 Meet up soon?",
  "🔥 What's up!",
  "😄 Long time no see!",
];

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage } = useChatStore();

  const handleQuickSend = (msg) => {
    sendMessage({ text: msg, image: null });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
      <div className="inline-flex items-center gap-2 bg-slate-700/40 rounded-full px-4 py-2 text-slate-400 text-xs mb-4">
        <LockIcon className="w-3 h-3" />
        Messages are end-to-end encrypted
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Say hi to <span className="text-slate-300 font-medium">{name}</span>!
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_MESSAGES.map((msg) => (
          <button
            key={msg}
            onClick={() => handleQuickSend(msg)}
            className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            {msg}
          </button>
        ))}
      </div>
    </div>
  );
};
export default NoChatHistoryPlaceholder;
