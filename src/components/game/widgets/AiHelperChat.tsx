import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Info } from "lucide-react";

export interface ChatMessageProps {
  sender: "user" | "ai_helper";
  text: string;
  context: string;
}


export interface ChatDisplayProps {
  messages: ChatMessageProps[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}


export const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  const t = useTranslations("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto p-3 linear-gradient custom-scrollbar rounded-t-lg">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Info className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-center text-sm text-slate-400 italic">
            {t("phase1_chatPlaceholder")}
          </p>
        </div>
      )}
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          sender={msg.sender}
          text={msg.text}
          context={msg.context}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div className={cn("flex mb-3", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-lg px-4 py-2.5 max-w-[85%] text-sm shadow-md transition-all",
          isUser
            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
            : "bg-white text-black font-semibold border border-slate-200"
        )}
      >
        {isUser
          ? text
          : text.split(".").map((paragraph, index) => (
              <span key={index}>
                {paragraph.trim()}
                {index !== text.split(".").length - 1 && "."}
                <br />
                <br />
              </span>
            ))}
      </div>
    </div>
  );
};

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isSending,
}) => {
  const [input, setInput] = useState("");
  const t = useTranslations();

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-100 to-slate-50 border-t border-slate-200 flex-shrink-0 rounded-b-lg"
    >
      <Input
        type="text"
        placeholder="Ask AI Helper a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isSending}
        className="flex-grow bg-white border-slate-300 focus-visible:ring-primary focus-visible:border-primary text-slate-900 placeholder:text-slate-400 shadow-sm"
      />
      <Button
        type="submit"
        disabled={isSending || !input.trim()}
        size="sm"
        className="bg-primary hover:bg-primary/90 text-white font-medium px-4 shadow-sm hover:shadow"
      >
        {isSending ? t("phase1_chatSending") : t("phase1_chatSend")}{" "}
      </Button>
    </form>
  );
};



