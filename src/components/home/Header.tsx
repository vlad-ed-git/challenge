"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/firebase/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const SiteHeader = () => {
  const { currentUserProfile, loadingUserProfile } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const route = useRouter();
  useEffect(() => {
    setIsLoading(loadingUserProfile);
    if (loadingUserProfile) {
      return;
    }
    setIsLoggedIn(!!currentUserProfile);
  }, [currentUserProfile, loadingUserProfile]);

  const onStartGame = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (!isLoggedIn) {
      route.push("/login");
    } else {
      route.push("/game");
    }
    setIsLoading(false);
  };

  const t = useTranslations("");
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/10"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="mr-4 flex items-center">
          {/* Apply heading font */}
          <span className="font-heading font-bold text-xl text-primary tracking-tighter">
            {t("app_name")}
          </span>
        </div>
        <Button
          onClick={onStartGame}
          disabled={isLoading}
          size="sm"
          variant="ghost"
          className="px-4 text-gray-200 hover:bg-white/10 hover:text-gray-50"
          aria-label="Begin the CHALLENGE"
        >
          {isLoading ? t("loading_auth_text") : t("start_game")}
        </Button>
      </div>
    </motion.header>
  );
};

export default SiteHeader;
