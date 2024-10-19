<template>
    <input
        :max="max"
        :min="min"
        :step="step"
        :value="normalizedValue"
        class="slider"
        type="range"
        @input="emit('update:model-value', Number($event.target.value))"
    >
</template>

<script setup>
import { computed } from "vue-demi";

const emit = defineEmits(["update:model-value"]);

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        default: 10,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    step: {
        type: Number,
        default: 1,
    },
    trackColour: {
        type: String,
        default: "gray",
    },
    fillColour: {
        type: String,
        default: "whitesmoke",
    },
});

const stepCount = computed(() => (props.max - props.min) / props.step);
const normalizedValue = computed(() => (Math.floor(props.modelValue / props.step) * props.step));
const currentStep = computed(() => (normalizedValue.value - props.min) / props.step);
const percentage = computed(() => (currentStep.value / stepCount.value) * 100);

const sliderBackground = computed(() => `linear-gradient(to right, var(--luma-primary) ${ percentage.value }%, var(--luma-secondary) ${ percentage.value }%)`);

const cssSize = computed(() => props.size + "px");
</script>

<style lang="scss" scoped>
$track-w: 100%;
$track-h: v-bind("props.size * 0.4 + 'px'");
$thumb-d: v-bind(cssSize);

.slider {
    cursor: pointer;
}

@mixin track() {
    box-sizing: border-box;
    border: none;
    width: $track-w;
    height: $track-h;
    border-radius: v-bind("props.size * 0.2 + 'px'");
    background: v-bind(sliderBackground);
}

@mixin thumb() {
    box-sizing: border-box;
    border: none;
    width: $thumb-d;
    height: $thumb-d;
    border-radius: 50%;
    background: var(--luma-primary);
}

[type='range'] {
    margin: 0;
    padding: 0;
    width: $track-w;
    height: $thumb-d;
    background: transparent;
    font: 1em/1 arial, sans-serif;

    &, &::-webkit-slider-thumb {
        -webkit-appearance: none;
    }

    &::-webkit-slider-runnable-track {
        @include track;
    }

    &::-moz-range-track {
        @include track;
    }

    &::-ms-track {
        @include track;
    }

    &::-webkit-slider-thumb {
        margin-top: calc(0.5 * ($track-h - $thumb-d));
        @include thumb;
    }

    &::-moz-range-thumb {
        @include thumb;
    }

    &::-ms-thumb {
        margin-top: 0;
        @include thumb;
    }

    &::-ms-tooltip {
        display: none
    }
}
</style>
