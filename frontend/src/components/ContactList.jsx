import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { SearchIcon } from "lucide-react";

function ContactList() {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    selectedUser,
    isUsersLoading,
    searchQuery,
    setSearchQuery,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const filtered = allContacts.filter((c) =>
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
            placeholder="Search contacts..."
            className="w-full bg-slate-700/50 border border-slate-600/40 rounded-full py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {allContacts.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No contacts found
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No contacts match
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-700/30">
          {filtered.map((contact) => {
            const isOnline = onlineUsers.includes(contact._id);
            const isSelected = selectedUser?._id === contact._id;
            return (
              <div
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-slate-700/60" : "hover:bg-slate-700/30"
                }`}
              >
                <div
                  className={`avatar ${isOnline ? "online" : "offline"} flex-shrink-0`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={contact.profilePic || "/avatar.png"}
                      alt={contact.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium text-sm truncate">
                    {contact.fullName}
                  </p>
                  <p className="text-xs mt-0.5 text-slate-500">
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
export default ContactList;
