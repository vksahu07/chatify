import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-900">
      {/* SIDEBAR */}
      <div
        className={`
          flex flex-col bg-slate-800/60 backdrop-blur-sm border-r border-slate-700/50
          w-full md:w-[340px] lg:w-[380px] flex-shrink-0
          ${selectedUser ? "hidden md:flex" : "flex"}
        `}
      >
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${selectedUser ? "flex" : "hidden md:flex"}
        `}
      >
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}
export default ChatPage;
