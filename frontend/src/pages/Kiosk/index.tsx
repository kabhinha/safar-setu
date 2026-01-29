import { useEffect } from 'react';
import { KioskProvider, useKiosk } from './context';
import KioskLayout from './KioskLayout';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelection from './components/LanguageSelection';
import HomeScreen from './components/HomeScreen';
import SelectionScreen from './components/SelectionScreen';
import ResultsScreen from './components/ResultsScreen';
import KioskDetailScreen from './components/DetailScreen';
import SafetyPanel from './components/SafetyPanel';

const KioskContent = () => {
    const { step } = useKiosk();

    return (
        <KioskLayout>
            {step === 'welcome' && <WelcomeScreen />}
            {step === 'language' && <LanguageSelection />}
            {step === 'home' && <HomeScreen />}
            {step === 'selection' && <SelectionScreen />}
            {step === 'results' && <ResultsScreen />}
            {step === 'detail' && <KioskDetailScreen />}
            {step === 'safety' && <SafetyPanel />}
        </KioskLayout>
    );
};

const KioskApp = () => {
    useEffect(() => {
        // Add kiosk-specific class to body for global styling overrides if needed
        document.body.classList.add('kiosk-mode');
        return () => {
            document.body.classList.remove('kiosk-mode');
        };
    }, []);

    return (
        <KioskProvider>
            <KioskContent />
        </KioskProvider>
    );
};

export default KioskApp;
