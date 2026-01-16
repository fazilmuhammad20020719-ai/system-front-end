
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // Trigger loader on route change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Minimum 0.5 second duration

        return () => clearTimeout(timer);
    }, [location.pathname]); // Runs on path change

    // Function to manually trigger loader for actions
    const triggerLoading = (duration = 500) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, duration);
    };

    return (
        <LoaderContext.Provider value={{ isLoading, triggerLoading }}>
            {children}
            {isLoading && <Loader />}
        </LoaderContext.Provider>
    );
};
