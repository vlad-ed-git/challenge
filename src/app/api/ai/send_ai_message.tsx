import ai from "./config";

/**
 * Sends the user's message and current game context to the AI helper
 * and returns the AI's response.
 *
 * @param prompt - The user's message to the AI.
 * @returns A promise that resolves with the AI's response text, or throws an error.
 */
export const getHelpFromMyAi = async (
  prompt: string
): Promise<string> => {
  try {
   

    const response = await ai.generate({
      prompt: prompt,
      config: {
      temperature: 0.7,
    maxOutputTokens: 500,
      },
    });

    const responseText = response.text;
    console.log("Received AI response:", responseText); // For debugging
    return responseText;
  } catch (error) {
    console.error("Error getting help from AI:", error);
      return "";
  }
};
