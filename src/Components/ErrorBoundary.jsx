import React from 'react';
import useErrorBoundary from '../Hooks/useErrorBoundary';
import logo from "../assets/images/logo.png";
const ErrorBoundary = ({ children, fallback }) => {
    const { error, resetError, handleNavigate } = useErrorBoundary();


    if (error) {
        return fallback ? (
            React.cloneElement(fallback, { error, resetError, handleNavigate })
        ) : (
            <div className="flex flex-col justify-center items-center h-screen font-medium">
                <img src={logo} style={{ width: "300px", height: "100px" }} alt="" />
                <h1>Something went wrong</h1>
                <div className="space-x-1 space-y-1">
                    <button onClick={resetError} style={{ borderRadius: "10px", border: "1px solid #4CAF50", outline: "1px", paddingLeft: "10px", paddingRight: "10px" }}>Try Again</button>
                    <button onClick={handleNavigate} style={{ borderRadius: "10px", border: "1px solid #4CAF50", outline: "1px", paddingLeft: "10px", paddingRight: "10px" }}>Home</button>
                </div>
            </div>
        );
    }

    return children;
};

export default ErrorBoundary;
