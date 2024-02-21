import { computed } from "vue-demi";

const format = (value) => value.toString().padStart(2, "0");

export const useTimeDisplay = (time) => computed(() => {
    const seconds = Math.floor(time.value);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    let timeDisplay = "";

    if (hours !== 0) {
        timeDisplay += format(hours) + ":";
    }

    timeDisplay += format(minutes % 60) + ":";
    timeDisplay += format(seconds % 60);

    return timeDisplay;
});
