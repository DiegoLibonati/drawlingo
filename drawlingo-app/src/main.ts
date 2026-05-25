import { createApp } from "vue";
import { createPinia } from "pinia";
import { FaBug, FaCrown, FaExclamationTriangle, FaInfo } from "oh-vue-icons/icons";
import { OhVueIcon, addIcons } from "oh-vue-icons";

import App from "@/App.vue";

import router from "@/routes";

import "@/main.css";

const app = createApp(App);

addIcons(FaCrown);
addIcons(FaInfo);
addIcons(FaBug);
addIcons(FaExclamationTriangle);

app.use(createPinia());
app.use(router);
app.component("VIcon", OhVueIcon);

app.mount("#app");
