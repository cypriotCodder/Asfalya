"use client";

import React, { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

/**
 * @brief A split OTP input component with automatic focus management.
 * @param length The number of digits (default is 6).
 * @param value The current full string value.
 * @param onChange Callback for when the value changes.
 * @param disabled Whether the input is disabled.
 */
export default function OtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize inputsRef array
    useEffect(() => {
        inputsRef.current = inputsRef.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Only allow numeric input
        if (val && !/^\d+$/.test(val)) return;

        const newValue = value.split("");
        // Ensure the array is at least as long as our index
        while (newValue.length < length) newValue.push("");

        newValue[index] = val.slice(-1);
        const updatedString = newValue.slice(0, length).join("");
        onChange(updatedString);

        // Move to next input if value was entered
        if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!value[index] && index > 0) {
                // If current is empty, move back and focus
                inputsRef.current[index - 1]?.focus();
            } else if (value[index]) {
                // If has value, delete it
                const newValue = value.split("");
                newValue[index] = "";
                onChange(newValue.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim().slice(0, length);
        if (!/^\d+$/.test(pastedData)) return;

        onChange(pastedData);

        // Focus the last filled input or the first empty one
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputsRef.current[nextIndex]?.focus();
    };

    return (
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {Array.from({ length }).map((_, index) => (
                <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold"
                    value={value[index] || ""}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    ref={(el) => { inputsRef.current[index] = el; }}
                />
            ))}
        </div>
    );
}
