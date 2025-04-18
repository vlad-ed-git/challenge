"use client";;
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const SiteFooter: React.FC = () => {

    const t = useTranslations("");
  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
      className="w-full py-2 m-0"
    >
      <div className="container flex items-center justify-center text-center text-xs text-gray-600 px-4">
       {t("footer_text")}
      </div>
    </motion.footer>
  );
};

export default SiteFooter;
