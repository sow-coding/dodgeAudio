export async function getTextFromSpeech (blob: Blob) {
    const file = new File([blob], "audio", { type: "audio/webm" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "gpt-4o-transcribe");

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        headers: {
            Authorization: `Bearer ${import.meta.env.WXT_OPENAI_API_KEY}`
        },
        method: "POST",
        body: formData
    });

    if(!res.ok) {
        console.error(await res.text());
        throw new Error("Transcription failed");
    };

    const data = await res.json();
    return data;
}