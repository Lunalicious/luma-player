<template>
    <button class="luma-button" type="button" @click="emit('click')">
        <luma-icon v-if="icon" :key="icon" :icon="icon" />
        <slot v-else />
    </button>
</template>

<script setup>
import LumaIcon from "@/components/controls/LumaIcon.vue";

const emit = defineEmits(["click"]);

defineProps({
    icon: {
        type: String,
        default: undefined,
    },
});
</script>

<style lang="scss" scoped>
button.luma-button {
    border: none;
    height: 100%;
    aspect-ratio: 2;
    max-width: var(--luma-controls-height);
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: whitesmoke;

    &:hover {
        cursor: pointer;
    }
}
</style>