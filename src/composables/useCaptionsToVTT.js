import { computed, unref } from "vue-demi";
import { useObjectUrl } from "@vueuse/core";

export const useCaptionsToVTT = (captions) => computed(() => {
    const rawCaptions = unref(captions);

    if (!rawCaptions) return "";
    if (typeof rawCaptions === "string") return rawCaptions;
    if (!Array.isArray(rawCaptions)) return "";

    const initial = "WEBVTT\n\n";

    const data = rawCaptions.reduce((data, {
        from,
        to,
        text
    }) => `${ data }${ from } --> ${ to } line:85%\n${ text }\n\n`, initial);

    const blob = new Blob([data], {
        type: "text/vtt",
    });

    return useObjectUrl(blob).value;
});