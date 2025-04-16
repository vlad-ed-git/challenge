import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface ChatMessageProps {
  sender: "user" | "ai_helper";
    text: string;
    context: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
    const isUser = sender === "user";
    

  return (
    <div className={cn("flex mb-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-lg px-3 py-1.5 max-w-[80%] text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-slate-100 text-slate-800 border border-slate-200"
        )}
      >
        {text}
      </div>
    </div>
  );
};

export interface ChatDisplayProps {
  messages: ChatMessageProps[];
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
    <div className="h-[320px] overflow-y-auto p-2 border border-slate-200 rounded-md bg-white custom-scrollbar">
      {messages.length === 0 && (
        <p className="text-center text-sm text-slate-400 italic pt-4">
          {t("phase1_chatPlaceholder")}
        </p>
      )}
      {messages.map((msg, index) => (
          <ChatMessage key={index} sender={msg.sender} text={msg.text}
            context={msg.context}
              />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}
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
      className="flex items-center gap-2 p-2 border-t border-slate-200 bg-slate-50"
    >
      <Input
        type="text"
        placeholder="Ask AI Helper a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isSending}
        className="flex-grow bg-white border-slate-300 focus-visible:ring-primary focus-visible:border-primary text-slate-900 placeholder:text-slate-400"
      />
      <Button type="submit" disabled={isSending || !input.trim()} size="sm">
        {isSending ? t("phase1_chatSending") : t("phase1_chatSend")}{" "}
      </Button>
    </form>
  );
};
