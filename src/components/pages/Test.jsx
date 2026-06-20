'use client';

import React, { useState } from "react";

const TTS = () => {
    const [text, setText] = useState("");
    const [speaking, setSpeaking] = useState(false);

    const speak = (lang = "en-IN") => {
        if (!text) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.95;
        utterance.pitch = 1;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const autoSpeak = () => {
        const isHindi = /[\u0900-\u097F]/.test(text);
        speak(isHindi ? "hi-IN" : "en-IN");
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>🔊 Text to Speech</h2>
                <p style={styles.subtitle}>
                    Type text and let the browser speak ✨
                </p>

                <textarea
                    style={styles.textarea}
                    placeholder="Type Hindi or English text here…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div style={styles.buttonGroup}>
                    <button
                        style={{ ...styles.button, background: "#f97316" }}
                        onClick={() => speak("hi-IN")}
                    >
                        🇮🇳 Speak Hindi
                    </button>

                    <button
                        style={{ ...styles.button, background: "#3b82f6" }}
                        onClick={() => speak("en-IN")}
                    >
                        🇺🇸 Speak English
                    </button>

                    <button
                        style={{ ...styles.button, background: "#0ea5e9" }}
                        onClick={autoSpeak}
                    >
                        🤖 Auto Speak
                    </button>

                    <button
                        style={{ ...styles.button, background: "#ef4444" }}
                        onClick={stop}
                    >
                        ⏹ Stop
                    </button>
                </div>

                <div style={styles.status}>
                    <span
                        style={{
                            ...styles.dot,
                            backgroundColor: speaking ? "#22c55e" : "#ef4444"
                        }}
                    />
                    {speaking ? "Speaking..." : "Idle"}
                </div>
            </div>
        </div>
    );
};

export default TTS;

/* 🎨 Styles */
const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "20px"
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        padding: "30px",
        width: "100%",
        maxWidth: "520px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
    },
    title: {
        margin: 0,
        fontSize: "26px",
        textAlign: "center"
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "20px"
    },
    textarea: {
        width: "100%",
        minHeight: "120px",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        outline: "none",
        resize: "none",
        marginBottom: "20px",
        fontSize: "15px",
        lineHeight: "1.6"
    },
    buttonGroup: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "15px"
    },
    button: {
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: 600,
        color: "#fff",
        cursor: "pointer"
    },
    status: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: 600
    },
    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%"
    }
};
