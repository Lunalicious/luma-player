import { computed } from "vue-demi";

const icons = import.meta.glob("../icons/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
});

export const useIconMap = (name) => computed(() => icons["../icons/" + name + ".svg"]);
