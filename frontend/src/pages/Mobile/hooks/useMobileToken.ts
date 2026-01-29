import { useSearchParams } from 'react-router-dom';

export const useMobileToken = () => {
    const [searchParams] = useSearchParams();
    const tokenParam = searchParams.get('t') ?? searchParams.get('token');
    const tokenProvided = searchParams.has('t') || searchParams.has('token');
    const token = (tokenParam ?? '').trim();
    const isExpired = searchParams.get('expired') === '1' || searchParams.get('status') === 'expired';

    // Treat tokens as optional but validate when explicitly provided
    const isValid = tokenProvided ? (token.length > 0 && !isExpired) : true;

    return { token, isValid, hasTokenParam: tokenProvided };
};
