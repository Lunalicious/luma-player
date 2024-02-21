const computeSpecialMediaType = (src) => new Promise((resolve) => {
    const videoElement = document.createElement("video");
    videoElement.src = src;

    videoElement.addEventListener("loadedmetadata", () => {
        resolve(videoElement.videoHeight === 0 || videoElement.videoWidth === 0 ? "audio" : "video");
    });

    videoElement.load();
});

export const getMediaType = async (src, fallback = "video") => {
    if (src.endsWith(".ogg") || src.endsWith(".webm") || src instanceof Blob) {
        if (src instanceof Blob) {
            src = URL.createObjectURL(src);
        }

        const media = await computeSpecialMediaType(src);
        URL.revokeObjectURL(src);

        return media;
    }

    const response = await fetch(src, {
        method: "HEAD",
    });

    const type = response.headers.get("Content-Type")?.split("/")[0];

    if (type === "audio" || type === "video") {
        return type;
    }

    return fallback;
};
