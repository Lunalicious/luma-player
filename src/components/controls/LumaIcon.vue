<template>
    <i :key="icon" ref="iconWrapper" class="luma-icon" v-html="iconElement" />
</template>

<script async setup>
import { ref, watch } from "vue-demi";
import { useIconMap } from "@/composables/useIconMap.js";

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    colour: {
        type: String,
        default: "var(--luma-icon)",
    },
    size: {
        type: String,
        default: "var(--luma-icon-size)",
    },
});

const iconElement = useIconMap(props.icon);

const iconWrapper = ref(null);

// For some reason CSS styling won't do the trick
// This seems a bit weird but SVGs will otherwise overflow vertically
watch(iconWrapper, (el) => {
    const svg = el?.querySelector("svg");
    if (!svg) return;
    svg.style.maxHeight = "100%";
});
</script>

<style scoped>
.luma-icon {
    height: v-bind("props.size");
    width: v-bind("props.size");
    fill: v-bind("props.colour");
    display: grid;
    justify-items: center;
    align-content: center;
}
</style>
