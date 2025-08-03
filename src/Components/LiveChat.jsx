import { useEffect, useState } from "react";
import { Send, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function LiveChat() {
  // Mock user data - replace with your actual user state management

  const userr = useSelector((state) => state.auth.user);
  console.log(userr);
  const user = {
    _id: userr?._id,
    name: userr?.name || "",
    profilePic: userr?.profilePic || "",
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Transform API response to component format
  const transformMessages = (apiData) => {
    if (!apiData?.data) return [];

    return apiData.data
      .map((msg) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.sender?._id || msg.sender, // Keep the actual sender ID
        timestamp: new Date(msg.date),
        senderName: msg.sender?.name || "Unknown",
        senderAvatar: msg.sender?.profilePic,
        receiverName: msg.receiver?.name || "Unknown",
      }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Get messages function
  async function getMessages() {
    if (!user?._id) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "/api/"}message/support/get`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: user._id,
            receiver:
              localStorage.getItem("___admin") || "6866a2057c2654f650804f07",
          }),
        }
      );

      const data = await response.json();
      const transformedMessages = transformMessages(data);
      setMessages(transformedMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Initial load and polling setup
  useEffect(() => {
    if (!user?._id) return;

    // Initial fetch
    getMessages();

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      getMessages();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [user?._id]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || !user?._id) return;

    const messageText = newMessage;
    setNewMessage(""); // Clear input immediately

    // Add message to UI optimistically
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: user._id, // Use user._id for consistency
      timestamp: new Date(),
      senderName: user.name || "You",
      senderAvatar: user.profilePic,
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Send to server
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "/api/"}message/support/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            sender: user._id,
            receiver:
              localStorage.getItem("___admin") || "6866a2057c2654f650804f07",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Refresh messages after sending
      setTimeout(() => {
        getMessages();
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove failed message and restore input
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setNewMessage(messageText);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100  flex flex-col ">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Customer Support</h2>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isLoading ? "bg-yellow-400 animate-pulse" : "bg-emerald-400"
                  }`}
                ></div>
                {/* <p className="text-sm text-gray-300">
                  {isLoading ? "Checking for new messages..." : "Messages refresh every 30 seconds"}
                </p> */}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Secure & Confidential</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1  overflow-y-auto  py-4">
        <div className="px-4 mx-auto space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === user._id ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.sender === user._id
                    ? ""
                    : "flex-row-reverse space-x-reverse"
                }`}
              >
                {/* Avatar */}
                {message.sender !== user._id && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {message.senderAvatar ? (
                      <img
                        src={`https://api.request-sa.com/${message.senderAvatar}`}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-600" />
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === user._id
                      ? "bg-white border border-gray-200 shadow-sm"
                      : "bg-white text-white"
                  }`}
                >
                  {message.sender !== user._id && (
                    <p className="bg-white border border-gray-200 shadow-sm text-xs text-black mb-1 font-medium">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm text-black">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === user._id
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages.length === 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-gray-500">Loading messages...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-blue-600 bg-slate-700 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={18} />
            <span className="font-medium  ">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
