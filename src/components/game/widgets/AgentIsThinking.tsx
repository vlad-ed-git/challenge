import React from "react";

export const AgentIsThinking: React.FC = () => {
  return (
    
    <div
      className="flex space-x-1 justify-start items-center h-4 my-1" 
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Thinking...</span> {/* Accessibility text */}
      {/* Three pulsing dots using the primary color */}
      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></div>
      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div
        className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]" // Adjusted delay slightly for better visual flow
      ></div>
    </div>
  );
};