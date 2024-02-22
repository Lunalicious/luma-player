import {usePreferredReducedMotion, watchImmediate} from "@vueuse/core";
import { ref, onMounted } from "vue-demi";

export const useEnvironment = () => {
    const isMobile = ref(false);
    const isIos = ref(false);
    const isMobileIos = ref(false);
    const animate = ref(false);

    onMounted(() => {
        const ua = navigator.userAgent;
        isMobile.value = ua.toLowerCase().includes("mobi");
        isIos.value = /iPad|iPhone|iPod/.test(ua);
        isMobileIos.value = isMobile.value && isIos.value;

        const motion = usePreferredReducedMotion();
        watchImmediate(motion, (value) => {
            animate.value = value !== "reduce";
        });
    });

    return {
        isMobile,
        isIos,
        isMobileIos,
        animate,
    };
};
