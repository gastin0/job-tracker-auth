"use client";

import { useState, useEffect } from "react";

export default function NotificationToast({
    message,
    isVisible,
    onClose,
    duration = 2500,
    variant = "success",
}){
    const [shouldRender, setShouldRender] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);

            const timer = setTimeout(() => {
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            const timeout = setTimeout(() => {
                setShouldRender(false)
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [isVisible, duration, onClose]);

    if (!shouldRender) return null;

    const variantStyles = {
        success: {
            bg: "bg-gray-50",
            text: "text-green-700",
            border: "border-green-700"
        },
        error: {
            bg: "bg-gray-50",
            text: "text-red-700",
            border: "border-red-700"
        },
        info: {
            bg: "bg-gray-50",
            text: "text-blue-700",
            border: "border-blue-700"
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className={`
            fixed top-4 left-1/2 -translate-x-1/2
            px-4 py-2 rounded-lg shadow-lg
            border-2 border-solid
            transition-opacity duration-300 font-semibold
            ${styles.bg} ${styles.text} ${styles.border}
            ${isVisible ? "opacity-100" : "opacity-0"}
        `}>
            {message}
        </div>
    )
}