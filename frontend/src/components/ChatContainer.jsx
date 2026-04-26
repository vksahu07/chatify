import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messageEndRef = useRef(null);
  const isTyping = typingUsers[selectedUser._id];
  const isReceiverOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(100,116,139,0.07) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="space-y-1">
            {messages.map((msg, i) => {
              const isMine = msg.senderId === authUser._id;
              const prevMsg = messages[i - 1];
              const nextMsg = messages[i + 1];
              const isFirst = !prevMsg || prevMsg.senderId !== msg.senderId;
              const isLast = !nextMsg || nextMsg.senderId !== msg.senderId;
              const time = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${isFirst ? "mt-3" : "mt-0.5"}`}
                >
                  {!isMine && (
                    <div className="w-7 h-7 flex-shrink-0 mb-1">
                      {isLast && (
                        <img
                          src={selectedUser.profilePic || "/avatar.png"}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[65%] md:max-w-[55%] flex flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-3 py-2 shadow-sm ${
                        isMine
                          ? "bg-cyan-600 text-white rounded-br-sm"
                          : "bg-slate-700 text-slate-100 rounded-bl-sm"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-xl max-h-60 object-cover mb-1 w-full"
                        />
                      )}
                      {msg.text && (
                        <p className="text-sm leading-relaxed break-words">
                          {msg.text}
                        </p>
                      )}
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <span
                          className={`text-[10px] ${isMine ? "text-cyan-200/70" : "text-slate-400"}`}
                        >
                          {time}
                        </span>
                        {isMine && (
                          <span
                            className={`text-[10px] ${isReceiverOnline ? "text-cyan-200" : "text-cyan-300/60"}`}
                          >
                            {isReceiverOnline ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-2 mt-3">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}
export default ChatContainer;
