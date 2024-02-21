import { useMutationObserver } from "@vueuse/core";
import { onBeforeUnmount } from "vue-demi";

export const useDisableNativeControls = (lumaPlayer) => {
    const { stop: stopAttributeObserver } = useMutationObserver(lumaPlayer, ([{ target, attributeName }]) => {
        if (attributeName === "controls") {
            target.removeAttribute("controls");
        }
    }, { attributes: true });

    onBeforeUnmount(stopAttributeObserver);
};
