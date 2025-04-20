"use client";
import { collection, doc, getDoc, onSnapshot, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { PolicySelections } from "@/components/game/types";

const multiplayerSessionsCollection = "multiplayer_sessions";
export const MAX_PLAYERS = 2; // for the demo


export interface ChatMessage {
    uid: string;
    displayName: string;
    message: string;
    timestamp: number;
}

export interface GameSession {
    sessionId: string;
    hostUid: string;
    participants: Participant[];
    createdAt: Timestamp;
    maxPlayers: number;
    status: 'lobby' | 'phase1_selection' | 'phase2_deliberation' | 'phase3_reflection' | 'complete';
    chatMessages?: ChatMessage[]; // Add this field
}
export interface Participant {
    uid: string;
    displayName: string;
    isHost: boolean;
    latestSelections: PolicySelections | null;
    hasSubmitted: boolean; // Track if player has submitted their selections
}

export interface UpdateSessionResponse {
    success: boolean,
    message: 'joined' | 'no_such_session' | 'session_is_full' | 'unknown_error' | 'no_host' | 'not_enough_players' | 'game_started' | 'not_participant' | 'updated',
    sessionId: string | undefined
}


// generates a random 6 digit number
const generateRandomSix = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const generateSessionId = async () => {
    // Repeats until we get an untaken ID
    let sessionId: string | null = null;
    let sessionRef: any = null; // Replace 'any' with the appropriate type if known
    const maxAttempts = 5; // Limit the number of attempts
    let attempts = 0;

    while (sessionId == null && sessionRef == null && attempts < maxAttempts) {
        const randomSix = generateRandomSix();
        const potentialSessionId = `session_${randomSix}`;
        // Check if not taken
        const potentialSessionRef = doc(db, multiplayerSessionsCollection, potentialSessionId);

        try {
            const sessionSnap = await getDoc(potentialSessionRef);
            const exists = sessionSnap.exists();
            if (!exists) {
                sessionId = potentialSessionId;
                sessionRef = potentialSessionRef;
                break;
            }
        } catch (error) {
            console.error("Error checking session ID:", error);
        }

        attempts++;
    }

    if (sessionId == null) {
        throw new Error('Failed to generate a unique session ID after multiple attempts.');
    }

    return {
        sessionId: sessionId!,
        sessionRef: sessionRef!
    }
}


export const createGameSession = async (
    hostId: string,
    hostName: string,
): Promise<string | null> => {

    try {
        const { sessionId, sessionRef } = await generateSessionId();
        const host: Participant = {
            uid: hostId,
            displayName: hostName,
            isHost: true,
            latestSelections: null,
            hasSubmitted: false
        };
        const gameSession: GameSession = {
            sessionId: sessionId,
            hostUid: hostId,
            participants: [host],
            status: 'lobby',
            createdAt: Timestamp.now(),
            maxPlayers: MAX_PLAYERS,
        }
        await setDoc(sessionRef, gameSession);
        return sessionId;
    } catch (error) {
        console.error("Error creating game session:", error);
        return null;
    }
}

export const joinGameSession = async (
    sessionId: string,
    userId: string,
    userName: string,
): Promise<UpdateSessionResponse> => {

    try {
        const sessionRef = doc(db, multiplayerSessionsCollection, sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
            return { success: false, message: 'no_such_session', sessionId: undefined };
        }

        const sessionData = sessionSnap.data() as GameSession;

        // Check if user is already in the session
        const existingParticipant = sessionData.participants.find(p => p.uid === userId);
        if (existingParticipant) {
            return { success: true, message: 'joined', sessionId };
        }

        if (sessionData.participants.length >= MAX_PLAYERS) {
            return { success: false, message: 'session_is_full', sessionId: undefined };
        }

        const newParticipant: Participant = {
            uid: userId,
            displayName: userName,
            isHost: false,
            latestSelections: null,
            hasSubmitted: false
        };

        await updateDoc(sessionRef, {
            participants: [...sessionData.participants, newParticipant],
        });

        return { success: true, message: 'joined', sessionId };
    } catch (error) {
        console.error("Error joining game session:", error);
        return { success: false, message: 'unknown_error', sessionId: undefined };
    }
}

export const startGameSession = async (
    sessionId: string,
    hostUid: string,
): Promise<UpdateSessionResponse> => {
    try {
        const sessionRef = doc(db, multiplayerSessionsCollection, sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
            return { success: false, message: 'no_such_session', sessionId: undefined };
        }

        const sessionData = sessionSnap.data() as GameSession;
        if (sessionData.hostUid !== hostUid) {
            return { success: false, message: 'no_host', sessionId: undefined };
        }

        if (sessionData.participants.length < 2) {
            return { success: false, message: 'not_enough_players', sessionId: undefined };
        }

        await updateDoc(sessionRef, {
            status: 'phase1_selection'
        });

        return { success: true, message: 'game_started', sessionId: sessionId };
    } catch (error) {
        console.error("Error starting game session:", error);
        return { success: false, message: 'unknown_error', sessionId: undefined };
    }
}

/**
 * Submit player selections and update their status in the session
 */
export const submitPlayerSelections = async (
    sessionId: string,
    userId: string,
    selections: PolicySelections,
): Promise<UpdateSessionResponse> => {
    try {
        const sessionRef = doc(db, multiplayerSessionsCollection, sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
            return { success: false, message: 'no_such_session', sessionId: undefined };
        }

        const sessionData = sessionSnap.data() as GameSession;
        const participants = sessionData.participants;
        const participantIndex = participants.findIndex(p => p.uid === userId);

        if (participantIndex === -1) {
            return { success: false, message: 'not_participant', sessionId: undefined };
        }

        // Create a new array with the updated participant
        const updatedParticipants = [...participants];
        updatedParticipants[participantIndex] = {
            ...participants[participantIndex],
            latestSelections: selections,
            hasSubmitted: true
        };

        await updateDoc(sessionRef, {
            participants: updatedParticipants
        });

        // Check if all participants have submitted - if host, move to next phase
        const allSubmitted = updatedParticipants.every(p => p.hasSubmitted);
        if (allSubmitted && userId === sessionData.hostUid) {
            await updateDoc(sessionRef, {
                status: 'phase2_deliberation'
            });
        }

        return { success: true, message: 'updated', sessionId };
    } catch (error) {
        console.error("Error submitting player selections:", error);
        return { success: false, message: 'unknown_error', sessionId: undefined };
    }
}

// real time stream that observes the game session
export const observeGameSession = (
    sessionId: string,
    callback: (sessionData: GameSession) => void,
) => {
    const sessionRef = doc(db, multiplayerSessionsCollection, sessionId);
    const unsubscribe = onSnapshot(sessionRef, (doc) => {
        if (doc.exists()) {
            const sessionData = doc.data() as GameSession;
            callback(sessionData);
        } else {
            console.error("No such document!");
        }
    });

    return unsubscribe;
}