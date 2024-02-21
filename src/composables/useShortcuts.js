import { computed } from "vue-demi";

const defaultShortcuts = {
    play: "k",
    fullscreen: "f",
    mute: "m",
    captions: "c",
    volumeUp: "ArrowUp",
    volumeDown: "ArrowDown",
    jumpForward: "ArrowRight",
    jumpBackward: "ArrowLeft",
};

const SPACE_KEY = " ";

export const useShortcuts = (customShortcuts, fns) => {

    const shortcuts = computed(() => ({
        ...defaultShortcuts,
        ...customShortcuts.value,
    }));

    const isShortcut = (key) => key === SPACE_KEY || Object.values(shortcuts).includes(key);

    const actions = computed(() => ({
        [SPACE_KEY]: fns.play,
        [shortcuts.value.play]: fns.play,
        [shortcuts.value.fullscreen]: fns.fullscreen,
        [shortcuts.value.mute]: fns.mute,
        [shortcuts.value.captions]: fns.captions,
        [shortcuts.value.volumeUp]: fns.volumeUp,
        [shortcuts.value.volumeDown]: fns.volumeDown,
        [shortcuts.value.jumpForward]: fns.jumpForward,
        [shortcuts.value.jumpBackward]: fns.jumpBackward,
    }));

    const handleEventKey = (key) => {
        actions.value[key]?.();
    };

    return {
        mergedShortcuts: shortcuts,
        SPACE_KEY,
        isShortcut,
        handleEventKey,
    };
};
