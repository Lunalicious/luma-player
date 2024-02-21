import { computed } from "vue-demi";

export const useMediaType = (mediaType) => ({
    isAudio: computed(() => mediaType.value === "audio"),
    isVideo: computed(() => mediaType.value === "video"),
});
