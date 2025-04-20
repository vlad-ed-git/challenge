import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Check, Copy, LogOut } from "lucide-react";

import { useAuth } from "@/lib/firebase/auth";
import { motion } from "framer-motion";
import { GameSession } from "@/lib/firebase/multiplayer/fire_functions";

interface LobbyProps {
  sessionData: GameSession | null;
  onStartGame: () => Promise<void>;
  onLeaveLobby: () => Promise<void>;
  isLoadingAction: boolean;
}

export function Lobby({
  sessionData,
  onStartGame,
  onLeaveLobby,
  isLoadingAction,
}: LobbyProps) {
  const t = useTranslations("");
  const { currentUserProfile } = useAuth();
  const isHost = currentUserProfile?.uid === sessionData?.hostUid;
  const canStart =
    sessionData &&
    sessionData.participants.length >= 2 &&
    sessionData.participants.length <= sessionData.maxPlayers;

  const copyCode = () => {
    if (sessionData?.sessionId) {
      navigator.clipboard
        .writeText(sessionData.sessionId)
        .then(() => {
          console.log("Code copied!");
        })
        .catch((err) => console.error("Failed to copy code: ", err));
    }
  };

  if (!sessionData) {
    return (
      <div className="text-center text-slate-400">
        {t("multiplayer_lobby_loading")}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto text-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold font-heading text-primary mb-4">
        {t("multiplayer_lobby_title")}
      </h2>
      <p className="text-slate-300 mb-6">
        {t("multiplayer_lobby_waiting", {
          count: sessionData.participants.length,
          max: sessionData.maxPlayers,
        })}
      </p>

      <div className="mb-6">
        <p className="text-sm text-slate-400 mb-1">
          {t("multiplayer_lobby_sessionCodeLabel")}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Input
            readOnly
            value={sessionData.sessionId}
            className="w-auto flex-shrink text-center font-mono text-xl tracking-widest bg-slate-900 border-slate-600 text-white p-2 h-10"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            title={t("multiplayer_lobby_copyCodeTooltip") || "Copy Code"}
          >
            <Copy className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </div>

      <div className="mb-6 text-left bg-slate-700/30 border border-slate-600 rounded-md p-4 max-h-48 overflow-y-auto custom-scrollbar">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">
          {t("multiplayer_lobby_participantsTitle")}
        </h3>
        <ul className="space-y-2">
          {sessionData.participants.map((p) => (
            <li
              key={p.uid}
              className="flex items-center justify-between text-slate-200 text-sm p-1.5 bg-slate-800/50 rounded"
            >
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {p.displayName || p.uid.substring(0, 6)}{" "}
                {p.uid === currentUserProfile?.uid
                  ? t("multiplayer_lobby_you")
                  : ""}{" "}
                {p.isHost ? t("multiplayer_lobby_host") : ""}
              </span>
              {/* Can show status later */}
              {/* <span className="text-xs text-slate-400">Waiting...</span> */}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          variant="outline"
          onClick={onLeaveLobby}
          disabled={isLoadingAction}
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-200"
        >
          {isLoadingAction ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="ml-2">{t("multiplayer_lobby_leaveButton")}</span>
        </Button>
        {isHost && (
          <Button
            onClick={onStartGame}
            disabled={!canStart || isLoadingAction}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoadingAction ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span className="ml-2">{t("multiplayer_lobby_startButton")}</span>
          </Button>
        )}
        {!isHost && (
          <p className="text-sm text-slate-400 self-center">
            {t("multiplayer_lobby_waitForHost")}
          </p>
        )}
      </div>
    </motion.div>
  );
}
