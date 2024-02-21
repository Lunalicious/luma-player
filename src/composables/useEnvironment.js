import { usePreferredReducedMotion } from "@vueuse/core";
import { ref, computed } from "vue-demi";

const isMobile = computed(() => window.navigator.userAgent.toLowerCase().includes("mobi"));
const isIos = ref(/iPad|iPhone|iPod/.test(navigator.userAgent));
const isMobileIos = computed(() => isMobile.value && isIos.value);

const motion = usePreferredReducedMotion();
const animate = computed(() => motion.value !== "reduce");

export const useEnvironment = () => ({
    isMobile,
    isIos,
    isMobileIos,
    animate,
});
