import React, { createContext, useContext, useState, useEffect } from 'react';
import { use } from 'react';

export const ControlsContext = createContext();

export const useControls = () => useContext(ControlsContext);

export const ControlsProvider = ({ children }) => {
    const [navExpanded, setNavExpanded] = useState(true);
    const [mobileDropdown, setMobileDropdown] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const navigationExpander = () => {
        setNavExpanded((prevState) => !prevState);
    };

    const mobileSidebar = () => {
        console.log('clicked');
        setMobileDropdown((prevState) => !prevState);
    }

    useEffect(() => {
        if (mobileDropdown) {
            document.querySelector("div.apply-overlay").classList.add("overlay-show");
        } else {
            document.querySelector("div.apply-overlay").classList.remove("overlay-show");
        }
    }, [mobileDropdown]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ControlsContext.Provider value={{ navExpanded, navigationExpander, mobileDropdown, mobileSidebar, windowWidth }}>
            {children}
        </ControlsContext.Provider>
    );
};