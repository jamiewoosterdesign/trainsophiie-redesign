
export const getPreferredVoice = (voices) => {
    if (!voices || voices.length === 0) return null;
    return voices.find(v => v.name.includes('Google US English')) ||
        voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices[0];
};

export const speakText = (text, voices, onEnd, onError) => {
    if (!window.speechSynthesis) {
        console.error("Speech synthesis not supported");
        return;
    }

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const voice = getPreferredVoice(voices);
    if (voice) u.voice = voice;

    // Adjust rate/pitch if needed to sound more natural
    u.rate = 1.0;
    u.pitch = 1.0;

    if (onEnd) u.onend = onEnd;
    if (onError) u.onerror = onError;

    window.speechSynthesis.speak(u);
    return u;
};
