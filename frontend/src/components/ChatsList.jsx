import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { SearchIcon } from "lucide-react";

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
    unreadCounts,
    searchQuery,
    setSearchQuery,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  const filtered = chats.filter((c) =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-slate-700/50 border border-slate-600/40 rounded-full py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {chats.length === 0 ? (
        <NoChatsFound />
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No chats found
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-700/30">
          {filtered.map((chat) => {
            const isOnline = onlineUsers.includes(chat._id);
            const isSelected = selectedUser?._id === chat._id;
            const unread = unreadCounts[chat._id] || 0;

            return (
              <div
                key={chat._id}
                onClick={() => setSelectedUser(chat)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-slate-700/60" : "hover:bg-slate-700/30"
                }`}
              >
                <div
                  className={`avatar ${isOnline ? "online" : "offline"} flex-shrink-0`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={chat.profilePic || "/avatar.png"}
                      alt={chat.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-200 font-medium text-sm truncate">
                      {chat.fullName}
                    </p>
                    {unread > 0 && (
                      <span className="ml-2 flex-shrink-0 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isOnline ? "🟢 Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default ChatsList;
