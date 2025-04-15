"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { useTranslations } from "next-intl";


// Define the Highlight component used for interpolation
const Highlight = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold text-primary/90">{children}</span>
);

const LandingPage = () => {
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
  const title = "CHALLENGE";
  const titleLetters = Array.from(title);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.7, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",

      transition: {
        type: "spring",
        damping: 14,
        stiffness: 120,

        filter: { duration: 0.4, ease: "easeOut" },
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const buttonPulse = {
    pulse: {
      scale: [1, 1.03, 1],
      boxShadow: [
        "0 0 0 0 hsl(var(--primary) / 0.3)",
        "0 0 0 10px hsl(var(--primary) / 0)",
        "0 0 0 0 hsl(var(--primary) / 0)",
      ],
      transition: {
        duration: 1.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.7,
      },
    },
    hover: { scale: 1.06, transition: { duration: 0.25 } },
    tap: { scale: 0.97 },
  };


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
  
  const t = useTranslations("");
  
  return (
    <main className="flex flex-grow flex-col items-center justify-center p-4 pt-10 md:pt-0 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(to right, #4682B4 1px, transparent 1px), linear-gradient(to bottom, #4682B4 1px, transparent 1px)`,
          backgroundSize: `60px 60px`,
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{
          duration: 220,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl text-center z-10 flex flex-col items-center"
      >
        {/* Apply heading font */}
        <motion.h1
          variants={itemFadeUp}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 inline-flex text-primary font-heading"
          aria-label={title}
        >
          <AnimatePresence>
            {titleLetters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                transition={{
                  delay:
                    index * 0.05 +
                    containerVariants.visible.transition.delayChildren,
                }}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.h1>

        <motion.p
          variants={itemFadeUp}
          className="text-md lg:text-xl mb-6 font-medium text-gray-400 px-4 max-w-2xl"
        >
          (Creating Holistic Approaches for Learning, Liberty, and Equity in New
          Global Education)
        </motion.p>

        <motion.div
          variants={itemFadeUp}
          className="max-w-3xl mx-auto mb-10 space-y-4 text-lg md:text-xl text-gray-200 leading-relaxed font-sans"
        >
          <p>
            {t.rich("description.paragraph1", {
              highlight: (chunks) => <Highlight>{chunks}</Highlight>,
            })}
          </p>

          <p>
            {t.rich("description.paragraph2", {
              highlight: (chunks) => <Highlight>{chunks}</Highlight>,
            })}
          </p>
        </motion.div>

        <motion.div variants={itemFadeUp} className="relative">
          <motion.div
            variants={buttonPulse}
            animate="pulse"
            whileHover="hover"
            whileTap="tap"
            className="inline-block"
          >
            <Button
              size="lg"
              onClick={onStartGame}
              className="px-16 py-8 text-xl md:text-2xl font-bold font-sans text-primary-foreground bg-primary rounded-lg shadow-lg transition-all duration-300 hover:bg-primary/90"
              aria-label="Begin the CHALLENGE"
            >
              {t("start_game")}
            </Button>
          </motion.div>
        </motion.div>

        <motion.p variants={itemFadeUp} className="text-sm text-gray-500 mt-12">
          {t("landing_page_footer_text")}
        </motion.p>
      </motion.div>
    </main>
  );
};

export default LandingPage;
