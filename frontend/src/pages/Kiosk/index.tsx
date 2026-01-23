import { useEffect } from 'react';
import { KioskProvider, useKiosk } from './context';
import KioskLayout from './KioskLayout';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelection from './components/LanguageSelection';
import SelectionScreen from './components/SelectionScreen';
import ResultsScreen from './components/ResultsScreen';
import KioskDetailScreen from './components/DetailScreen';

const KioskContent = () => {
    const { step } = useKiosk();

    return (
        <KioskLayout>
            {step === 'welcome' && <WelcomeScreen />}
            {step === 'language' && <LanguageSelection />}
            {step === 'selection' && <SelectionScreen />}
            {step === 'results' && <ResultsScreen />}
            {step === 'detail' && <KioskDetailScreen />}
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
