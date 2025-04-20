import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface JoinOrCreateSessionProps {
  onCreateSession: () => Promise<void>;
  onJoinSession: (sessionId: string) => Promise<boolean>;
  isCreating: boolean;
  isJoining: boolean;
  joinError: string | null;
}

export function JoinOrCreateSession({
  onCreateSession,
  onJoinSession,
  isCreating,
  isJoining,
  joinError,
}: JoinOrCreateSessionProps) {
  const t = useTranslations();

  const [sessionIdInput, setSessionIdInput] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionIdInput.trim().length > 0 && !isJoining) {
      await onJoinSession(sessionIdInput.trim());
    }
  };

  const handleCreate = () => {
    if (!isCreating) {
      onCreateSession();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto text-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold font-heading text-primary mb-4">
        {t("multiplayer_joinOrCreate_title")}
      </h2>
      <p className="text-slate-300 mb-6">
        {t("multiplayer_joinOrCreate_subtitle")}
      </p>

      <form onSubmit={handleJoin} className="space-y-4 mb-6">
        <div className="space-y-2 text-left">
          <Label htmlFor="session-code" className="text-slate-200">
            {t("multiplayer_join_label")}
          </Label>
          <div className="flex gap-2">
            <Input
              id="session-code"
              value={sessionIdInput}
              onChange={(e) => setSessionIdInput(e.target.value)}
              placeholder={t("multiplayer_join_placeholder")}
              className="flex-grow bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 tracking-widest text-center font-mono"
              disabled={isJoining || isCreating}
            />
            <Button
              type="submit"
              disabled={
                isJoining || isCreating || sessionIdInput.trim().length === 0
              }
            >
              {isJoining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span className="ml-2">{t("multiplayer_join_button")}</span>
            </Button>
          </div>
          {joinError && (
            <p className="text-xs text-red-400 mt-1">{joinError}</p>
          )}
        </div>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-800/50 px-2 text-slate-400">
            {t("multiplayer_or")}
          </span>
        </div>
      </div>

      <Button
        onClick={handleCreate}
        variant="outline"
        className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-200"
        disabled={isCreating || isJoining}
      >
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="h-4 w-4" />
        )}
        <span className="ml-2">{t("multiplayer_create_button")}</span>
      </Button>
    </motion.div>
  );
}
