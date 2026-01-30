"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export default function ConfirmDeleteModal({
    open,
    state,
    title,
    description,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    isLoading = false,
    onConfirm,
    onCancel,
}) {
    const [hasMounted, setHasMounted] = useState(false);
    const modalRef = useRef(null);
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        setHasMounted(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
    }, []);

    useEffect(() => {
        if (!open) return;
        cancelButtonRef.current?.focus();
    }, [open])

    useEffect(() => {
        if (!open) return;
        const focusableSelectors = [
            'button',
            '[href]',
            'input',
            'select',
            'textarea',
            '[tabindex]:not([tabindex="-1"])',
        ];

        const focusableElements = modalRef.current?.querySelectorAll(
            focusableSelectors.join(',')
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                if (!isLoading) {
                    onCancel();
                }
                return;
            }

            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, isLoading, onCancel]);

    if (!open || !hasMounted) return null;

    return (
        <div className="fixed inset-0 z-50">

            <div className="relative flex h-full w-full items-start justify-center">
                <div
                    className="absolute inset-0 bg-gray-900/40 z-0"
                    onClick={isLoading ? undefined : onCancel}
                />
                <div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    className={`
                        relative z-10 mt-50 w-full max-w-md rounded-xl bg-white p-6 shadow-lg
                        transition-all duration-200
                        ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                    `}
                >
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        {state == "idle" && (
                            <div className="transition-all duration-200 ease-out opacity-100 translate-y-0 scale-100">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h2>
                                <div className="mt-2 text-sm text-gray-600">
                                    {description}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        ref={cancelButtonRef}
                                        type="button"
                                        onClick={onCancel}
                                        disabled={isLoading}
                                        className="rounded-md border px-4 py-2 text-sm text-gray-100 bg-gray-700 hover:bg-gray-500 disabled:opacity-50"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className="rounded-md border px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {isLoading ? "Deleting..." : confirmLabel}
                                    </button>
                                </div>
                            </div>
                        )}

                        {state == "loading" && (
                            <div className="
                            flex flex-col items-center gap-3 py-6
                            transition-all duration-1000 ease-out opacity-100 translate-y-0 scale-100"
                            >
                                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                                <p className="text-sm text-gray-600">
                                    Deleting Application...
                                </p>
                            </div>
                        )}

                        {state == "success" && (
                            <div className="
                            flex flex-col items-center gap-3 py-6
                            transition-all duration-200 ease-out opacity-100 translate-y-0 scale-100"
                            >
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                <p className="text-sm text-green-700">
                                    Application deleted successfully
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}