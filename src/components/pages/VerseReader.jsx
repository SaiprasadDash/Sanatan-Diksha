'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Apiconnect from '@/services/Apiconnect';
import { useParams } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useTranslation } from "react-i18next";
import "../style.css";

const STORAGE_KEY = "geeta_progress";

const getProgressFromStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { completedVerses: {} };
};

const saveProgressToStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const markVerseCompleted = (chapterNo, verseNo) => {
    const data = getProgressFromStorage();
    const key = `chapter-${chapterNo}`;
    if (!data.completedVerses[key]) data.completedVerses[key] = [];
    if (!data.completedVerses[key].includes(verseNo)) {
        data.completedVerses[key].push(verseNo);
        saveProgressToStorage(data);
    }
};

const GitaVerseReader = () => {
    const pathname = usePathname();
    const searchParams = new URLSearchParams(location.search);
    const verseParam = searchParams.get('verse');
    const router = useRouter();
    const { slug } = useParams();
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [customQuestion, setCustomQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chapterData, setChapterData] = useState(null);
    const [allChapters, setAllChapters] = useState([]);
    const [isAsking, setIsAsking] = useState(false);
    const [typingDots, setTypingDots] = useState('.');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const messagesContainerRef = useRef(null);
    const { i18n } = useTranslation();
    const [voiceLang, setVoiceLang] = useState(i18n.language || "en");
    const isVoiceInputRef = useRef(false);
    const audioRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const silenceTimerRef = useRef(null);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const [speakingIndex, setSpeakingIndex] = useState(null);

    const GOOGLE_TTS_API_KEY = "AIzaSyBXO43A17orETU2UaU1jk4SGCEvkUEs8hY";

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (!chapterData || !currentVerse) return;
        const chapterNo = chapterData.chapter_no;
        const verseNo = typeof currentVerse.verse_no === "string"
            ? currentVerse.verse_no.replace("Verse", "").trim()
            : currentVerse.verse_no;
        markVerseCompleted(chapterNo, verseNo);
    }, [currentVerseIndex, chapterData]);

    useEffect(() => {
        setVoiceLang(i18n.language === "hi" ? "hi" : "en");
    }, [i18n.language]);

    useEffect(() => { scrollToBottom(); }, [messages, isAsking]);

    useEffect(() => {
        if (!listening) return;
        setCustomQuestion(transcript);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            if (transcript.trim()) {
                handleCustomSubmit(transcript);
                resetTranscript();
                setIsListening(false);
                SpeechRecognition.stopListening();
            }
        }, 3500);
    }, [transcript]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isAsking) return;
        const interval = setInterval(() => {
            setTypingDots((prev) => prev === '...' ? '.' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, [isAsking]);

    useEffect(() => { if (slug) fetchChapterData(); }, [slug, verseParam]);

    const fetchChapterData = async () => {
        try {
            setLoading(true);
            const res = await Apiconnect.postData(`admin_chapterlist/${slug}`);
            if (res.data?.status === 1 && res.data?.data) {
                setChapterData(res.data.data);
                if (verseParam && res.data.data.verses) {
                    const verseIndex = res.data.data.verses.findIndex(v => {
                        const verseNumber = typeof v.verse_no === 'string' ? v.verse_no.replace(/[^0-9]/g, '') : String(v.verse_no);
                        const paramNumber = String(verseParam).replace(/[^0-9]/g, '');
                        return verseNumber === paramNumber;
                    });
                    setCurrentVerseIndex(verseIndex !== -1 ? verseIndex : 0);
                } else {
                    setCurrentVerseIndex(0);
                }
                setMessages([]);
            } else {
                setChapterData(null);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chapter data:', error);
            setLoading(false);
        }
    };

    const handleMicClick = async () => {
        if (!browserSupportsSpeechRecognition) { alert("Speech recognition not supported in this browser."); return; }
        if (listening) { SpeechRecognition.stopListening(); return; }
        try {
            isVoiceInputRef.current = true;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            SpeechRecognition.startListening({ language: voiceLang === "en" ? "en-IN" : "hi-IN", continuous: false, interimResults: false });
        } catch (err) {
            console.error("Mic permission denied:", err);
            alert("Please allow microphone access to use voice input.");
        }
    };

    const toggleLanguage = () => {
        const newLang = voiceLang === "en" ? "hi" : "en";
        setVoiceLang(newLang);
        i18n.changeLanguage(newLang);
    };

    const askVedAI = async (question) => {
        try {
            const payload = { query: question, book_id: chapterData.book_id, chapter_id: chapterData.id };
            const res = await Apiconnect.postData("ved_ai", payload);
            if (res.data?.status === 1 && res.data?.response?.text) {
                return res.data.response.text.replace(/^Assistent:\s*/i, "");
            }
            return "No response received from Ved AI.";
        } catch (error) {
            console.error("Ved AI Error:", error);
            return "An error occurred while seeking divine wisdom.";
        }
    };

    const currentVerse = chapterData?.verses?.[currentVerseIndex];
    const suggestedQuestions = ["Explain this verse simply", "How does this apply to my life?", "What is the deeper meaning?"];

    const handleQuestionClick = async (question) => {
        isVoiceInputRef.current = false;
        if (!chapterData) return;
        setMessages(prev => [...prev, { type: 'user', text: question }]);
        setIsAsking(true);
        const aiReply = await askVedAI(question);
        setIsAsking(false);
        setMessages(prev => [...prev, { type: 'krishna', text: aiReply }]);
    };

    const handleCustomSubmit = async (voiceText) => {
        const isVoice = !!voiceText;
        const question = voiceText ?? customQuestion;
        if (!question.trim() || !chapterData) return;
        setMessages(prev => [...prev, { type: 'user', text: question }]);
        setCustomQuestion('');
        setIsAsking(true);
        const aiReply = await askVedAI(question);
        setIsAsking(false);
        const newMessage = { type: 'krishna', text: aiReply };
        setMessages(prev => [...prev, newMessage]);
        if (isVoice) {
            const index = messages.length;
            setTimeout(() => { speakText(aiReply, index, voiceLang === "hi" ? "hi-IN" : "en-IN"); }, 300);
        }
    };

    const speakWithGoogle = async (text, lang = "en-IN", index = null) => {
        try {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null; }
            setSpeakingIndex(index);
            const voiceConfig = lang === "hi-IN"
                ? { languageCode: "hi-IN", name: "hi-IN-Wavenet-B" }
                : { languageCode: "en-IN", name: "en-IN-Wavenet-B" };
            const response = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: { text }, voice: voiceConfig, audioConfig: { audioEncoding: "MP3", speakingRate: 0.95, pitch: 0 } }) }
            );
            const data = await response.json();
            if (!data.audioContent) throw new Error("No audio content received");
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            audioRef.current = audio;
            audio.onended = () => { setSpeakingIndex(null); audioRef.current = null; };
            audio.onerror = () => { setSpeakingIndex(null); audioRef.current = null; };
            await audio.play();
        } catch (error) {
            console.error("Google TTS Error:", error);
            setSpeakingIndex(null);
        }
    };

    const speakText = (text, index = null, lang = "en-IN") => {
        if (!text) return;
        speakWithGoogle(text, lang, index);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null; }
        setSpeakingIndex(null);
    };

    const handlePrevious = () => { if (currentVerseIndex > 0) { setCurrentVerseIndex(currentVerseIndex - 1); setMessages([]);  window.scrollTo({
            top: 0,
            behavior: "smooth"
        });} };
    const handleNext = () => { if (chapterData?.verses && currentVerseIndex < chapterData.verses.length - 1) { setCurrentVerseIndex(currentVerseIndex + 1); setMessages([]);  window.scrollTo({
            top: 0,
            behavior: "smooth"
        });} };
    const handleBackToChapters = () => router.push('/geeta');

    if (loading) {
        return (
            <SkeletonTheme baseColor="#2a0d51" highlightColor="#4a187e">
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 420px', gap: isMobile ? '16px' : '32px' }}>
                        <div>
                            <Skeleton height={120} borderRadius={20} />
                            <div style={{ marginTop: 24 }}><Skeleton height={40} width={120} /><Skeleton height={200} style={{ marginTop: 16 }} /><Skeleton count={4} style={{ marginTop: 12 }} /></div>
                            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}><Skeleton height={52} width="50%" /><Skeleton height={52} width="50%" /></div>
                        </div>
                        {!isMobile && <div><Skeleton height={900} borderRadius={24} /></div>}
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    if (!currentVerse) {
        return (
            <div className={`gvr-no-verse ${isMobile ? 'gvr-no-verse-mobile' : ''}`}>
                No verse data available
            </div>
        );
    }

    const isLastVerse = currentVerseIndex === chapterData.verses.length - 1;
    const isFirstVerse = currentVerseIndex === 0;

    return (
        <div className="gvr-wrapper mt-5">

            {/* Header Row */}
            <div className={`gvr-header-row ${isMobile ? 'gvr-header-row-mobile' : ''}`}>
                <button
                    onClick={handleBackToChapters}
                    className={`gvr-back-btn ${isMobile ? 'gvr-back-btn-mobile' : ''}`}
                >
                    <span className={isMobile ? 'gvr-back-arrow-mobile' : 'gvr-back-arrow'}>←</span>
                    Back to Chapters
                </button>
            </div>

            <div className={`gvr-grid ${isMobile ? 'gvr-grid-mobile' : ''}`}>

                {/* ===== LEFT COLUMN ===== */}
                <div>

                    {/* Chapter Header */}
                    <div className={`gvr-chapter-header ${isMobile ? 'gvr-chapter-header-mobile' : ''}`}>
                        <div>
                            <div className={`gvr-chapter-badge ${isMobile ? 'gvr-chapter-badge-mobile' : ''}`}>
                                Chapter {chapterData.chapter_no || chapterData.id}
                            </div>
                            <h1 className={`gvr-chapter-title ${isMobile ? 'gvr-chapter-title-mobile' : ''}`}>
                                {chapterData.name}
                            </h1>
                            <p className={`gvr-chapter-subtitle ${isMobile ? 'gvr-chapter-subtitle-mobile' : ''}`}>
                                {chapterData.short_info}
                            </p>
                        </div>
                        <div className="gvr-active-badge">
                            <div className="gvr-active-dot" />
                            <span className={`gvr-active-label ${isMobile ? 'gvr-active-label-mobile' : ''}`}>Active</span>
                        </div>
                    </div>

                    {/* Verse Card */}
                    <div className={`gvr-verse-card ${isMobile ? 'gvr-verse-card-mobile' : ''}`}>

                        {/* Verse Header */}
                        <div className={`gvr-verse-header ${isMobile ? 'gvr-verse-header-mobile' : ''}`}>
                            <h2 className={`gvr-verse-no ${isMobile ? 'gvr-verse-no-mobile' : ''}`}>
                                {currentVerse.verse_no}
                            </h2>
                            <span className={`gvr-verse-counter ${isMobile ? 'gvr-verse-counter-mobile' : ''}`}>
                                {currentVerseIndex + 1} / {chapterData.verses.length}
                            </span>
                        </div>

                        {/* Sanskrit */}
                        <div className={`gvr-sanskrit-box ${isMobile ? 'gvr-sanskrit-box-mobile' : ''}`}>
                            <p className={`gvr-sanskrit-text ${isMobile ? 'gvr-sanskrit-text-mobile' : ''}`}>
                                {currentVerse.name}
                            </p>
                        </div>

                        {/* Audio */}
                        <div className={`gvr-section ${isMobile ? 'gvr-section-mobile' : ''}`}>
                            <div className="gvr-section-badge gvr-badge-audio">
                                <span>Audio</span>
                            </div>
                            {currentVerse.audio_path ? (
                                <audio key={currentVerse.audio_path || currentVerseIndex} controls className="gvr-audio-player">
                                    <source src={currentVerse.audio_path} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            ) : (
                                <p className={`gvr-no-audio ${isMobile ? 'gvr-no-audio-mobile' : ''}`}>
                                    Currently no audio available
                                </p>
                            )}
                        </div>

                        {/* Transliteration */}
                        <div className={`gvr-section ${isMobile ? 'gvr-section-mobile' : ''}`}>
                            <div className="gvr-section-badge gvr-badge-transliteration">
                                <span>Transliteration</span>
                            </div>
                            <p className={`gvr-transliteration-text ${isMobile ? 'gvr-transliteration-text-mobile' : ''}`}>
                                {currentVerse.transliteration}
                            </p>
                        </div>

                        {/* Translation */}
                        <div className={`gvr-section ${isMobile ? 'gvr-section-mobile' : ''}`}>
                            <div className="gvr-section-badge gvr-badge-translation">
                                <span>Translation</span>
                            </div>
                            <p className={`gvr-translation-text ${isMobile ? 'gvr-translation-text-mobile' : ''}`}>
                                {currentVerse.translation}
                            </p>
                        </div>

                        {/* Commentary */}
                        <div>
                            <div className="gvr-section-badge gvr-badge-commentary">
                                <span>Commentary</span>
                            </div>
                            <p className={`gvr-commentary-text ${isMobile ? 'gvr-commentary-text-mobile' : ''}`}>
                                {currentVerse.commentary}
                            </p>
                        </div>

                        {/* Feedback */}
                        <div className={`gvr-feedback-row ${isMobile ? 'gvr-feedback-row-mobile' : ''}`}>
                            <div
                                className="gvr-feedback-btn"
                                onClick={() => router.push("/feedback", { state: { from: pathname } })}
                            >
                                <span>Share Feedback</span>
                            </div>
                        </div>

                    </div>

                    {/* Navigation */}
                    <div className={`gvr-nav-row ${isMobile ? 'gvr-nav-row-mobile' : ''}`}>
                        <div className={`gvr-prev-next-row ${isMobile ? 'gvr-prev-next-row-mobile' : ''}`}>

                            <button
                                onClick={handlePrevious}
                                disabled={isFirstVerse}
                                className={`gvr-prev-btn ${isMobile ? 'gvr-prev-btn-mobile' : ''} ${isFirstVerse ? 'gvr-prev-btn-disabled' : 'gvr-prev-btn-enabled'}`}
                            >
                                <span>‹</span> Previous
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={isLastVerse}
                                className={`gvr-next-btn ${isMobile ? 'gvr-next-btn-mobile' : ''} ${isLastVerse ? 'gvr-next-btn-disabled' : 'gvr-next-btn-enabled'}`}
                            >
                                Next <span>›</span>
                            </button>

                        </div>
                    </div>

                </div>

                {/* ===== RIGHT COLUMN — Chat Panel ===== */}
                <div>
                    <div className={`gvr-chat-panel ${isMobile ? 'gvr-chat-panel-mobile' : ''}`}>

                        {/* Chat Header */}
                        <div className="gvr-chat-header">
                            <div className={`gvr-chat-avatar ${isMobile ? 'gvr-chat-avatar-mobile' : ''}`}>
                                <i className="bi bi-stars" style={{ color: 'white' }}></i>
                            </div>
                            <div>
                                <h3 className={`gvr-chat-title ${isMobile ? 'gvr-chat-title-mobile' : ''}`}>
                                    Ask Lord Krishna
                                </h3>
                                <p className={`gvr-chat-subtitle ${isMobile ? 'gvr-chat-subtitle-mobile' : ''}`}>
                                    Suggested Questions
                                </p>
                            </div>
                        </div>

                        <div className="gvr-chat-divider" />

                        {/* Messages */}
                        <div ref={messagesContainerRef} className="gvr-messages-container">
                            {messages.length === 0 ? (
                                <div className="gvr-suggested-list">
                                    {suggestedQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuestionClick(q)}
                                            className={`gvr-suggested-btn ${isMobile ? 'gvr-suggested-btn-mobile' : ''}`}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`gvr-msg-row ${msg.type === 'user' ? 'gvr-msg-row-user' : 'gvr-msg-row-krishna'}`}
                                    >
                                        {/* Krishna Avatar + Speaker */}
                                        {msg.type === 'krishna' && (
                                            <div className="gvr-krishna-avatar-col">
                                                <div className={`gvr-krishna-avatar ${isMobile ? 'gvr-krishna-avatar-mobile' : ''}`}>
                                                    <i className="bi bi-stars" style={{ color: "white" }}></i>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        speakingIndex === i
                                                            ? stopSpeaking()
                                                            : speakText(msg.text, i, voiceLang === "hi" ? "hi-IN" : "en-IN")
                                                    }
                                                    className={`gvr-speak-btn ${speakingIndex === i ? 'gvr-speak-btn-active' : 'gvr-speak-btn-inactive'}`}
                                                    title={speakingIndex === i ? "Stop" : "Speak"}
                                                >
                                                    <i className={speakingIndex === i ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill"} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        {msg.type === 'krishna' ? (
                                            <div className={`gvr-bubble-krishna ${isMobile ? 'gvr-bubble-krishna-mobile' : ''}`}>
                                                {msg.text}
                                            </div>
                                        ) : (
                                            <div className={`gvr-bubble-user ${isMobile ? 'gvr-bubble-user-mobile' : ''}`}>
                                                {msg.text}
                                            </div>
                                        )}

                                        {/* User Avatar */}
                                        {msg.type === 'user' && (
                                            <div className={`gvr-user-avatar ${isMobile ? 'gvr-user-avatar-mobile' : ''}`}>
                                                <i className="bi bi-person" style={{ color: 'white' }}></i>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* Typing Indicator */}
                            {isAsking && (
                                <div className="gvr-typing-row">
                                    <div className={`gvr-chat-avatar ${isMobile ? 'gvr-chat-avatar-mobile' : ''}`}>
                                        <i className="bi bi-stars" style={{ color: 'white' }}></i>
                                    </div>
                                    <div className={`gvr-typing-bubble ${isMobile ? 'gvr-typing-bubble-mobile' : ''}`}>
                                        {typingDots}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="gvr-input-wrapper">
                            <div className="gvr-input-box">

                                {/* Language Toggle */}
                                <div className="gvr-lang-toggle-wrap">
                                    <button onClick={toggleLanguage} className="gvr-lang-toggle-btn">
                                        {voiceLang === "en" ? "EN" : "हिंदी"}
                                    </button>
                                </div>

                                {/* Text Input */}
                                <input
                                    value={customQuestion}
                                    onChange={(e) => setCustomQuestion(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCustomSubmit(); } }}
                                    placeholder={voiceLang === "en" ? "Ask in English..." : "पूछें हिंदी में..."}
                                    className="gvr-text-input"
                                />

                                {/* Mic Button */}
                                <button
                                    onClick={handleMicClick}
                                    title="Speak"
                                    className={`gvr-mic-btn ${listening ? 'gvr-mic-btn-listening' : 'gvr-mic-btn-idle'}`}
                                >
                                    {listening ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                            <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
                                            <path d="M15 9.34V4a3 3 0 0 0-5.94-.6" />
                                            <path d="M19 10v2a7 7 0 0 1-1.88 4.76" />
                                            <path d="M5 10v2a7 7 0 0 0 7 7" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                    )}
                                </button>

                                {/* Send Button */}
                                <button onClick={() => handleCustomSubmit()} title="Send" className="gvr-send-btn">
                                    ➤
                                </button>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default GitaVerseReader;