import * as React from "react";

interface AlertProps {
    message: string;
    type?: "success" | "error" | "info";
    children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ message, type = "info", children }) => {
    return (
        <div className={`alert alert-${type}`}>
            {message}
            {children}
        </div>
    );
};

const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <strong className="alert-title">{children}</strong>
);

const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="alert-description">{children}</p>
);

export { Alert, AlertTitle, AlertDescription };
