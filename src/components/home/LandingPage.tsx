"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const SiteHeader: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
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
            CHALLENGE
          </span>
        </div>
        <Button
          onClick={onStartGame}
          size="sm"
          variant="ghost"
          className="px-4 text-gray-200 hover:bg-white/10 hover:text-gray-50"
          aria-label="Begin the CHALLENGE"
        >
          Begin
        </Button>
      </div>
    </motion.header>
  );
};

const SiteFooter: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
      className="w-full py-4"
    >
      <div className="container flex items-center justify-center text-center text-xs text-gray-600 px-4">
        Made by Vladimir Peter Kowelo @ ASU
      </div>
    </motion.footer>
  );
};

const LandingPage = () => {
  const onStartGame = () => {};
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-100 font-sans overflow-x-hidden">
      <SiteHeader onStartGame={onStartGame} />

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
            (Creating Holistic Approaches for Learning, Liberty, and Equity in
            New Global Education)
          </motion.p>

          <motion.div
            variants={itemFadeUp}
            className="max-w-3xl mx-auto mb-10 space-y-4 text-lg md:text-xl text-gray-200 leading-relaxed font-sans"
          >
            <p>
              Step into a{" "}
              <span className="font-semibold text-primary/90">
                reflective, participatory, and justice-oriented space
              </span>{" "}
              for engaging with refugee education policy. Rooted in critical
              pedagogy, this dynamic simulation exposes the{" "}
              <span className="font-semibold text-primary/90">
                contradictions, moral dilemmas, and political tensions
              </span>{" "}
              of real-world policymaking.
            </p>
            <p>
              In the Republic of Bean, make tough choices under{" "}
              <span className="font-semibold text-primary/90">
                tight budget constraints
              </span>
              . Grapple with competing demands: state control, citizen fears,
              and human rights. Don't just learn about policy –{" "}
              <span className="font-semibold text-primary/90">
                participate in shaping it
              </span>{" "}
              and challenge dominant paradigms.
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
                BEGIN CHALLENGE
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemFadeUp}
            className="text-sm text-gray-500 mt-12"
          >
            This is both a mirror and a window. See how decisions reflect power,
            envision true equity.
          </motion.p>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default LandingPage;
