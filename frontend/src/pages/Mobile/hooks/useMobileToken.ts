import { useSearchParams } from 'react-router-dom';

export const useMobileToken = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('t');

    // In a real implementation we would decode JWT/TimestampSigner token on client if possible 
    // or validate with backend. For this pilot, we just check existence and maybe format.
    // The backend views (Hotspot/Sight Public) might not strictly require the token for GET 
    // but we should show "invalid" if it's missing to prevent scraping if that was the intent.
    // However, existing backend ViewSets are AllowAny for GET public details.

    const isValid = !!token;

    return { token, isValid };
};
