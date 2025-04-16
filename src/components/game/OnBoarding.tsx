
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl'; 

export enum OnboardingStep {
  CHOOSE_MODE,
  WHO_YOU_ARE,
  WHO_AI_ARE,
  THE_GOAL,
  COMPLETE,
}

interface GameOnboardingProps {
  onOnboardingComplete: () => void; 
}

export function GameOnboarding({ onOnboardingComplete }: GameOnboardingProps) {
  const t = useTranslations(""); 
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.CHOOSE_MODE);

  const nextStep = () => {
    switch (currentStep) {
      case OnboardingStep.CHOOSE_MODE:
        setCurrentStep(OnboardingStep.WHO_YOU_ARE);
        break;
      case OnboardingStep.WHO_YOU_ARE:
        setCurrentStep(OnboardingStep.WHO_AI_ARE);
        break;
      case OnboardingStep.WHO_AI_ARE:
        setCurrentStep(OnboardingStep.THE_GOAL);
        break;
      case OnboardingStep.THE_GOAL:
        onOnboardingComplete(); 
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case OnboardingStep.WHO_YOU_ARE:
        setCurrentStep(OnboardingStep.CHOOSE_MODE);
        break;
      case OnboardingStep.WHO_AI_ARE:
        setCurrentStep(OnboardingStep.WHO_YOU_ARE);
        break;
      case OnboardingStep.THE_GOAL:
        setCurrentStep(OnboardingStep.WHO_AI_ARE);
        break;
      default:
        break;
    }
  };

  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    }),
  };

  
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.CHOOSE_MODE:
        return (
          <>
            <CardTitle className="text-2xl font-heading text-primary">{t('step1_title')}</CardTitle>
            <CardDescription className="text-black mt-1">{t('step1_subtitle')}</CardDescription>
            <div className="space-y-4 mt-6">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg" onClick={handleNext}>
                    {t('step1_option_single')}
                </Button>
                <Button className="w-full py-6 text-lg" variant="outline" disabled>
                    {t('step1_option_multi')} ({t('coming_soon')})
                </Button>
            </div>
          </>
        );
      case OnboardingStep.WHO_YOU_ARE:
        return (
          <>
            <CardTitle className="text-2xl font-heading text-primary">{t('step2_title')}</CardTitle>
            <CardDescription className="text-black mt-1">{t('step2_subtitle')}</CardDescription>
            <p className="mt-4 text-black leading-relaxed">{t('step2_text')}</p>
          </>
        );
      case OnboardingStep.WHO_AI_ARE:
         return (
           <>
             <CardTitle className="text-2xl font-heading text-primary">{t('step3_title')}</CardTitle>
             <CardDescription className="text-black mt-1">{t('step3_subtitle')}</CardDescription>
             <ul className="mt-4 space-y-2 text-black list-disc list-inside">
                <li><strong className='font-semibold'>{t('step3_agent1_name')}:</strong> {t('step3_agent1_desc')}</li>
                <li><strong className='font-semibold'>{t('step3_agent2_name')}:</strong> {t('step3_agent2_desc')}</li>
                <li><strong className='font-semibold'>{t('step3_agent3_name')}:</strong> {t('step3_agent3_desc')}</li>
             </ul>
           </>
         );
      case OnboardingStep.THE_GOAL:
        return (
          <>
            <CardTitle className="text-2xl font-heading text-primary">{t('step4_title')}</CardTitle>
            <CardDescription className="text-black mt-1">{t('step4_subtitle')}</CardDescription>
            <p className="mt-4 text-black leading-relaxed">{t('step4_text')}</p>
          </>
        );
      default:
        return null;
    }
  };

  const getButtonText = () => {
     switch (currentStep) {
       case OnboardingStep.CHOOSE_MODE: return ""; 
       case OnboardingStep.WHO_YOU_ARE: return t('button_got_it');
       case OnboardingStep.WHO_AI_ARE: return t('button_got_it');
       case OnboardingStep.THE_GOAL: return t('button_ready');
       default: return t('button_next');
     }
   };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 md:py-16 relative overflow-hidden">
       <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep} 
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full top-0 left-0" 
          >
              <Card className="border border-gray-200 bg-white shadow-lg w-full">
                <CardHeader>
                   <p className="text-xs text-black uppercase tracking-wider">Step {currentStep + 1} of 4</p> 
                </CardHeader>
                <CardContent className="min-h-[250px] flex flex-col justify-center">
                  {renderStepContent()}
                </CardContent>
                {currentStep !== OnboardingStep.CHOOSE_MODE && (
                   <CardFooter className="flex justify-between pt-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentStep === OnboardingStep.WHO_YOU_ARE} 
                        aria-label={t('button_back')}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('button_back')}
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        aria-label={getButtonText()}
                      >
                        {getButtonText()}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                   </CardFooter>
                )}
              </Card>
          </motion.div>
       </AnimatePresence>
       {/* Add a spacer div to maintain layout height during transitions */}
        <div className="min-h-[450px]"></div>
    </div>
  );
}



