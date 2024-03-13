<template>
    <div
        ref="lumaPlayerWrapper"
        class="luma-player-wrapper__internal"
        :class="{ 'disabled': disabled }"
        @keydown="disabled ? noop() : handleShortcuts($event)"
    >
        <img
            v-if="posterImage && isAudio"
            :alt="posterImageDescription"
            :src="posterImage"
            class="luma-player-poster__audio"
        >

        <component
            :is="mediaType"
            :key="src"
            ref="lumaPlayer"
            :autoplay="autoplay"
            :loop="loop"
            :muted="muted || autoplay"
            class="luma-player"
            preload="metadata"
            @click.prevent="updatePlaying(!playing)"
            @dblclick.prevent="isVideo && toggleFullscreen()"
        >
            <source :src="preloadedSrc">

            <template v-if="track">
                <track
                    :src="parsedTrack"
                    default
                    kind="subtitles"
                    label="CC"
                >
            </template>
        </component>

        <img
            v-if="posterImage && isVideo && !playing && currentTime < 0.2"
            :alt="posterImageDescription"
            :src="posterImage"
            class="luma-player-poster"
        >

        <component
            :is="Controls"
            v-if="isAudio || !hideControls"
            ref="lumaControls"
            :animate="animate"
            :class="{ 'hide': idle && playing && isVideo }"
            :currentTime="currentTime"
            :display-captions="selectedTrack !== -1"
            :duration="duration"
            :has-captions="track?.length"
            :is-fullscreen="isFullscreen"
            :is-mobile="isMobile"
            :is-video="isVideo"
            :muted="muted"
            :playing="playing"
            :volume="volume"
            :shortcuts="mergedShortcuts"
            class="luma-player-controls"
            @update:playing="updatePlaying(!playing)"
            @update:current-time="updateCurrentTime"
            @update:volume="volume = $event"
            @update:muted="muted = !muted"
            @update:fullscreen="toggleFullscreen"
            @update:display-captions="toggleCaptions"
        />

        <slot v-if="isVideo" :animate="animate" :playing="playing" name="main-icon">
            <transition :name="animate && 'fade-grow'">
                <luma-icon
                    v-if="!playing"
                    role="presentation"
                    class="main-icon"
                    icon="play"
                    size="var(--luma-icon-size-main)"
                />
            </transition>
        </slot>
    </div>
</template>

<script>
export default {
    name: "LumaPlayer",
};
</script>

<script setup>
import LumaControls from "@/components/LumaControls.vue";
import { getMediaType } from "@/util/mediaType";
import {
    clamp,
    computedAsync,
    noop,
    useFullscreen,
    useIdle,
    useMediaControls,
    useObjectUrl,
    watchImmediate,
} from "@vueuse/core";
import { computed, ref, toRefs, watch } from "vue-demi";
import { useCaptionsToVTT } from "@/composables/useCaptionsToVTT";
import { useEnvironment } from "@/composables/useEnvironment";
import { useMediaType } from "@/composables/useMediaType";
import { useDisableNativeControls } from "@/composables/useDisableNativeControls.js";
import LumaIcon from "@/components/controls/LumaIcon.vue";
import { useShortcuts } from "@/composables/useShortcuts.js";

const emit = defineEmits(["loading"]);

const props = defineProps({
    src: {
        type: [String, Blob],
        required: true,
    },
    type: {
        type: String,
        validator: (value) => ["video", "audio"].includes(value),
    },
    loop: {
        type: Boolean,
        default: false,
    },
    autoplay: {
        type: Boolean,
        default: false,
    },
    hideControls: {
        type: Boolean,
        default: false,
    },
    track: {
        type: [Array, String],
        default: undefined,
    },
    posterImage: {
        type: [String, Blob],
        default: null,
    },
    posterImageDescription: {
        type: String,
        default: "",
    },
    windTimeSeconds: {
        type: Number,
        default: 5,
    },
    volumeStep: {
        type: Number,
        default: 0.05,
    },
    shortcuts: {
        type: Object,
        default: {},
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    Controls: {
        type: Object,
        default: LumaControls,
    },
});

const { src, track, type, shortcuts } = toRefs(props);

const { isMobile, isMobileIos, animate } = useEnvironment();
const { idle, reset: resetIdleState } = useIdle(3000);

const srcString = computed(() => src.value instanceof Blob ? useObjectUrl(src).value : src.value);

// Fix for iOS Safari not displaying their poster image
const preloadedSrc = computed(() => isMobileIos.value ? srcString.value + "#t=0.01" : srcString.value);

const mediaType = computedAsync(async () => type.value || await getMediaType(src.value), "video");
const { isVideo, isAudio } = useMediaType(mediaType);

const parsedTrack = useCaptionsToVTT(track);

const lumaPlayer = ref(null);
const lumaPlayerWrapper = ref(null);
const lumaControls = ref(null);

const {
    playing,
    duration,
    currentTime,
    volume,
    muted,
    selectedTrack,
    enableTrack,
    disableTrack,
    waiting
} = useMediaControls(lumaPlayer);

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(lumaPlayerWrapper);

const toggleCaptions = () => {
    if (!track.value) return;

    if (selectedTrack.value === 0) {
        disableTrack(0);
    } else {
        enableTrack(0);
    }
};

const updatePlaying = (play, focus = false) => {
    // iOS Safari should only play videos in fullscreen mode (Requirement by Apple?)
    if (isMobileIos.value && !isFullscreen.value) {
        toggleFullscreen();
    }

    if (focus) {
        lumaPlayer.value?.focus();
    }

    playing.value = play;
};

const updateCurrentTime = (time) => {
    playing.value = false;
    currentTime.value = time;
};

watch(volume, (v) => muted.value = v === 0);

const windPlayerTime = (delta) => {
    updatePlaying(false);
    currentTime.value = clamp(currentTime.value + delta, 0, duration.value);
};

const changeVolume = (delta) => {
    volume.value = clamp(volume.value + delta, 0, 1);
};

const {
    handleEventKey,
    isShortcut,
    SPACE_KEY,
    mergedShortcuts,
} = useShortcuts(shortcuts.value, {
    play: () => updatePlaying(!playing.value),
    fullscreen: toggleFullscreen,
    mute: () => muted.value = !muted.value,
    captions: toggleCaptions,
    volumeUp: () => changeVolume(props.volumeStep),
    volumeDown: () => changeVolume(-props.volumeStep),
    jumpForward: () => windPlayerTime(props.windTimeSeconds),
    jumpBackward: () => windPlayerTime(-props.windTimeSeconds),
});

const handleShortcuts = (event) => {
    resetIdleState(); // Idle doesn't catch these Keyboard strokes, so we reset it manually

    const spacePressed = event.key === SPACE_KEY;

    // Do not handle Space Events on controls
    if (spacePressed && lumaControls.value?.$el?.contains(event.target)) {
        event.stopPropagation();
        event.target?.focus();
        return;
    }

    handleEventKey(event.key);

    if (isShortcut(event.key)) {
        event.preventDefault();
        event.target?.focus();
    }
};

watch(duration, (dur) => {
    // Fix for Chrome webm or blob duration being Infinity
    if (dur === Infinity) {
        lumaPlayer.value.currentTime = Number.MAX_SAFE_INTEGER;
        setTimeout(() => lumaPlayer.value.currentTime = 0, 0);
    }
});

watchImmediate(waiting, (newVal) => {
    if (!newVal) {
        currentTime.value = 0;
    }

    emit("loading", newVal);
});

useDisableNativeControls(lumaPlayer);
</script>

<style>
.luma-player-wrapper__internal * {
    min-width: 0;
    box-sizing: border-box;
}

:root {
    --luma-primary: whitesmoke;
    --luma-secondary: grey;
    --luma-controls: rgba(20, 20, 20, 0.8);
    --luma-controls-height: 40px;
    --luma-icon: var(--luma-primary);
    --luma-icon-size: 24px;
    --luma-icon-size-main: calc(var(--luma-icon-size) * 1.4);
}
</style>

<!--suppress CssUnusedSymbol -->
<style lang="scss" scoped>
.luma-player-wrapper__internal {
    display: flex;
    align-items: center; // This is just to ensure the video is in the middle of the screen when on mobile fullscreen
    position: relative;
    width: 100%;
    cursor: pointer;
    min-width: 0;
    min-height: var(--luma-controls-height);
    box-sizing: border-box;

    &.disabled {
        filter: saturate(0.7) brightness(0.7);
        pointer-events: none;
    }

    .luma-player {
        width: 100%;
    }

    .luma-player-controls {
        position: absolute;
        bottom: 0;
        opacity: 1;
        transition: opacity 0.5s ease;

        &.hide {
            opacity: 0;
        }
    }

    .luma-player-poster {
        position: absolute;
        height: 100%;
        width: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        pointer-events: none;

        &__audio {
            position: revert;
            cursor: default;
        }
    }

    .main-icon {
        position: absolute;
        top: calc(50% - 0.5 * var(--luma-icon-size-main));
        left: calc(50% - 0.5 * var(--luma-icon-size-main));
        pointer-events: none;
    }
}

.fade-grow-enter-active,
.fade-grow-leave-active {
    transition: all 0.25s ease;
}

.fade-grow-enter-from,
.fade-grow-leave-to {
    opacity: 0;
    transform: scale(3);
}
</style>
