import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'hi';

export interface KioskState {
    language: Language;
    step: 'welcome' | 'language' | 'selection' | 'results' | 'detail';
    selectedTime: number | null; // in minutes
    selectedInterests: string[];
    results: any[]; // Replace with proper type later
    selectedExperience: any | null;
}

interface KioskContextType extends KioskState {
    setLanguage: (lang: Language) => void;
    setStep: (step: KioskState['step']) => void;
    setSelectedTime: (time: number | null) => void;
    toggleInterest: (interest: string) => void;
    setResults: (results: any[]) => void;
    setSelectedExperience: (exp: any | null) => void;
    resetSession: () => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

const IDLE_TIMEOUT_MS = 120000; // 2 minutes

export const KioskProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<KioskState>({
        language: 'en', // Default, but flow starts with selection usually or defaults
        step: 'welcome',
        selectedTime: null,
        selectedInterests: [],
        results: [],
        selectedExperience: null,
    });

    // Idle Timer Logic
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (state.step !== 'welcome') {
                timeoutId = setTimeout(() => {
                    resetSession();
                }, IDLE_TIMEOUT_MS);
            }
        };

        // Attach listeners
        const events = ['mousedown', 'touchstart', 'scroll', 'click', 'keydown'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Initial start
        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [state.step]);

    const setLanguage = (lang: Language) => setState(prev => ({ ...prev, language: lang }));
    const setStep = (step: KioskState['step']) => setState(prev => ({ ...prev, step }));
    const setSelectedTime = (time: number | null) => setState(prev => ({ ...prev, selectedTime: time }));

    const toggleInterest = (interest: string) => {
        setState(prev => {
            const isSelected = prev.selectedInterests.includes(interest);
            return {
                ...prev,
                selectedInterests: isSelected
                    ? prev.selectedInterests.filter(i => i !== interest)
                    : [...prev.selectedInterests, interest]
            };
        });
    };

    const setResults = (results: any[]) => setState(prev => ({ ...prev, results }));
    const setSelectedExperience = (exp: any | null) => setState(prev => ({ ...prev, selectedExperience: exp }));

    const resetSession = useCallback(() => {
        setState({
            language: 'en', // Reset to default or keep? Requirement says reset clears data.
            step: 'welcome',
            selectedTime: null,
            selectedInterests: [],
            results: [],
            selectedExperience: null,
        });
    }, []);

    return (
        <KioskContext.Provider value={{
            ...state,
            setLanguage,
            setStep,
            setSelectedTime,
            toggleInterest,
            setResults,
            setSelectedExperience,
            resetSession
        }}>
            {children}
        </KioskContext.Provider>
    );
};

export const useKiosk = () => {
    const context = useContext(KioskContext);
    if (!context) {
        throw new Error('useKiosk must be used within a KioskProvider');
    }
    return context;
};
