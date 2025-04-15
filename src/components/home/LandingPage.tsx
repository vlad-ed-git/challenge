"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

const LandingPage = () => {
  const onStartGame = () => {};

     const title = "CHALLENGE";
     const titleLetters = Array.from(title);

     const containerVariants = {
       hidden: { opacity: 0 },
       visible: {
         opacity: 1,
         transition: {
           delayChildren: 0.3,
           staggerChildren: 0.2, 
         },
       },
     };

     const letterVariants = {
       hidden: { opacity: 0, y: 25, scale: 0.7, filter: "blur(8px)" },
       visible: {
         opacity: 1,
         y: 0,
         scale: 1,
         filter: "blur(0px)",
         transition: { type: "spring", damping: 14, stiffness: 120 },
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
         // Using ring instead of boxShadow for better theme integration potentially
         ringWidth: [0, 4, 0],
         ringOffsetWidth: [0, 2, 0],
         ringOpacity: [0, 0.3, 0], // Use ring utility which might respect theme color
         transition: {
           duration: 1.8,
           ease: "easeInOut",
           repeat: Infinity,
           repeatDelay: 0.7,
         },
       },
       hover: {
         scale: 1.06, // Slightly less intense hover scale
         // boxShadow: "0 0 15px 6px hsl(var(--primary) / 0.4)", // Using HSL variable - needs theme setup
         transition: { duration: 0.25 },
       },
       tap: {
         scale: 0.97,
       },
     };

     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-100 p-4 overflow-hidden relative font-inter">
         {/* Animated Grid Background */}
         <motion.div
           className="absolute inset-0 z-0 opacity-10"
           style={{
             backgroundImage: `linear-gradient(to right, #4682B4 1px, transparent 1px), linear-gradient(to bottom, #4682B4 1px, transparent 1px)`,
             backgroundSize: `50px 50px`, // Slightly larger grid
           }}
           animate={{
             backgroundPosition: ["0% 0%", "100% 100%"],
           }}
           transition={{
             duration: 180, // Slower movement
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
           {/* Title using Primary Theme Color */}
           <motion.h1
             className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 inline-flex text-primary" // Applied theme color
             aria-label={title}
           >
             <AnimatePresence>
               {titleLetters.map((letter, index) => (
                 <motion.span
                   key={`${letter}-${index}`}
                   variants={letterVariants}
                   className="inline-block"
                 >
                   {letter === " " ? "\u00A0" : letter}
                 </motion.span>
               ))}
             </AnimatePresence>
           </motion.h1>

           {/* Full Acronym */}
           <motion.p
             variants={itemFadeUp}
             className="text-md lg:text-xl mb-6 font-medium text-gray-400 px-4 max-w-2xl"
           >
             (Creating Holistic Approaches for Learning, Liberty, and Equity in
             New Global Education)
           </motion.p>

           {/* Expanded Description using source text */}
           <motion.div
             variants={itemFadeUp}
             className="max-w-3xl mx-auto mb-10 space-y-4 text-lg md:text-xl text-gray-200 leading-relaxed"
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

           {/* Button using Primary Theme Color */}
           <motion.div
             variants={itemFadeUp}
             className="relative" // Needed for potential absolute positioning of ring/shadow
           >
             <motion.div
               variants={buttonPulse}
               animate="pulse"
               whileHover="hover"
               whileTap="tap"
               className="inline-block ring-primary" // Apply primary ring color class
             >
               <Button
                 size="lg"
                 onClick={onStartGame}
                 className="px-16 py-8 text-xl md:text-2xl font-bold text-primary-foreground bg-primary rounded-lg shadow-lg transition-all duration-300 hover:bg-primary/90" // Theme colors applied
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
             This is both a mirror and a window. See how decisions reflect
             power, envision true equity.
           </motion.p>
         </motion.div>
       </div>
     );
};

export default LandingPage;
