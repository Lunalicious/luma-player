<template>
    <div class="luma-player-controls">
        <luma-button
            :icon="playingIcon"
            class="play-pause"
            :aria-pressed="playing"
            :aria-label="playing ? 'Pause' : 'Play'"
            :aria-keyshortcuts="shortcuts['play']"
            @click="emit('update:playing')"
        />
        <div v-if="!isMobile" ref="volumeWrapper" class="volume-wrapper" :aria-expanded="!animate || showVolumeSlider">
            <luma-button
                :icon="volumeIcon"
                :aria-pressed="muted"
                :aria-label="muted ? 'Unmute' : 'Mute'"
                :aria-keyshortcuts="shortcuts['mute']"
                @click="emit('update:muted')"
            />
            <transition name="slide-reveal">
                <luma-slider
                    v-if="!animate || showVolumeSlider"
                    role="slider"
                    :model-value="muted ? 0 : Math.floor(volume * 100)"
                    :aria-valuemin="0"
                    :aria-valuemax="100"
                    :aria-valuenow="volume"
                    aria-label="volume"
                    class="volume-slider"
                    :aria-keyshortcuts="shortcuts['volumeUp'] + ' ' + shortcuts['volumeDown']"
                    @update:model-value="emit('update:volume', Number(($event * 0.01).toFixed(2)))"
                />
            </transition>
        </div>
        <div class="time-display" :aria-label="currentTimeDisplay + 'of' + totalTimeDisplay + 'played'">{{ currentTimeDisplay + " / " + totalTimeDisplay }}</div>
        <luma-slider
            role="presentation"
            :max="duration"
            :model-value="currentTime"
            :style="{ 'margin-right': isVideo ? '' : '12px' }"
            class="progress"
            :aria-valuemin="0"
            :aria-valuemax="duration"
            :aria-valuenow="currentTime"
            :aria-keyshortcuts="shortcuts['jumpForward'] + ' ' + shortcuts['jumpBackward']"
            @update:model-value="emit('update:current-time', $event)"
        />
        <luma-button
            v-if="hasCaptions && isVideo"
            :icon="captionsIcon"
            class="captions"
            :aria-label="displayCaptions ? 'Hide Captions': 'Show Captions'"
            :aria-pressed="displayCaptions"
            :aria-keyshortcuts="shortcuts['captions']"
            @click="emit('update:display-captions')"
        />
        <luma-button
            v-if="isVideo"
            :icon="fullscreenIcon"
            :aria-pressed="isFullscreen"
            :aria-label="isFullscreen ? 'Exit Fullscreen': 'Enter Fullscreen'"
            :aria-keyshortcuts="shortcuts['fullscreen']"
            class="fullscreen"
            @click="emit('update:fullscreen')"
        />
    </div>
</template>

<script>
export default {
    name: "LumaControls",
};
</script>

<script setup>
import { computed, ref, toRefs, watch } from "vue-demi";
import LumaButton from "@/components/controls/LumaButton.vue";
import LumaSlider from "@/components/controls/LumaSlider.vue";
import { useElementHover, useFocusWithin } from "@vueuse/core";
import { useTimeDisplay } from "@/composables/useTimeDisplay.js";

const emit = defineEmits(["update:playing", "update:current-time", "update:volume", "update:muted", "update:fullscreen", "update:display-captions"]);

const props = defineProps({
    playing: {
        type: Boolean,
    },
    currentTime: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    volume: {
        type: Number,
    },
    muted: {
        type: Boolean,
    },
    isFullscreen: {
        type: Boolean,
    },
    displayCaptions: {
        type: Boolean,
    },
    hasCaptions: {
        type: Boolean,
    },
    animate: {
        type: Boolean,
    },
    isMobile: {
        type: Boolean,
    },
    isVideo: {
        type: Boolean,
    },
    shortcuts: {
        type: Object,
        default: {},
    },
});

const { playing, currentTime, duration, volume, muted, isFullscreen, displayCaptions } = toRefs(props);

const currentTimeDisplay = useTimeDisplay(currentTime);
const totalTimeDisplay = useTimeDisplay(duration);

const playingIcon = computed(() => playing.value ? "pause" : "play");
const fullscreenIcon = computed(() => isFullscreen.value ? "compress" : "expand");
const captionsIcon = computed(() => displayCaptions.value ? "closed-captioning-solid" : "closed-captioning-regular");
const volumeIcon = computed(() => muted.value || volume.value === 0 ? "volume-xmark" : "volume-high");

const volumeWrapper = ref(null);
const volumeHover = useElementHover(volumeWrapper);

// Here we have a reactivity bug from vue
const { focused } = useFocusWithin(volumeWrapper);
// The current workaround is an empty watcher on the resulting ref
watch(focused, () => {
});

const showVolumeSlider = computed(() => volumeHover.value || focused.value);
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.luma-player-controls {
    width: 100%;
    height: var(--luma-controls-height);
    background: var(--luma-controls);
    color: var(--luma-primary);
    display: flex;
    align-items: center;
    padding: 0 4px;
    cursor: default;
}

.volume-wrapper {
    display: flex;
    margin-right: 12px;
    height: 100%;
    align-items: center;
}

.volume-slider {
    width: calc(2 * var(--luma-controls-height));
}

.captions, .fullscreen {
    margin-left: 6px;
}

.time-display {
    font-family: "Roboto Light", sans-serif;
    font-size: 0.8rem;
    white-space: nowrap;
    min-width: revert;
    margin-right: 6px;
    cursor: text;
}

.slide-reveal-enter-active,
.slide-reveal-leave-active {
    transition: width 0.2s ease;
}

.slide-reveal-enter-from,
.slide-reveal-leave-to {
    width: 0;
}
</style>
