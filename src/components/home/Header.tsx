"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/firebase/auth";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const SiteHeader = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { currentUserProfile, loadingUserProfile, logout } = useAuth();
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

  const onLogout = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    await logout();
    setIsLoading(false);
    route.push("/");
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
        <div
          className="mr-4 flex items-center cursor-pointer"
          onClick={() => {
            route.push("/");
          }}
          role="button"
        >
          <span className="font-heading font-bold text-xl text-primary tracking-tighter cursor-pointer">
            {t("app_name")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <Button
              onClick={() => { 
                route.push("/profile");
              } }
              disabled={isLoading}
              size="sm"
              variant="ghost"
              className="px-4 text-gray-200 hover:bg-white/10 hover:text-gray-50"
              aria-label="view profile"
            >
              {isLoading ? t("loading_auth_text") : t("my_profile")}
            </Button>
          )}

          {isHomePage && (
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
          )}
          {!isHomePage && (
            <Button
              onClick={onLogout}
              disabled={isLoading}
              size="sm"
              variant="destructive"
              className="px-4 text-gray-200 hover:bg-white/10 hover:text-gray-50"
              aria-label="Begin the CHALLENGE"
            >
              {isLoading ? t("loading_auth_text") : t("logout")}
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default SiteHeader;
