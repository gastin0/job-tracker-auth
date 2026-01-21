"use client";

import { useEffect, useRef } from "react";

export default function ConfirmDeleteModal({
    open,
    title,
    description,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    isLoading = false,
    onConfirm,
    onCancel,
}) {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        if (open) {
            cancelButtonRef.current?.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-block/40"
                onClick={isLoading ? undefined : onCancel}
            />

            <div className="relative flex justify-center">
                <div className="mt-50 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {description}
                    </p>

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
            </div>
        </div>
    )
}