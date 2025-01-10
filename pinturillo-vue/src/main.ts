import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import {
  FaBug,
  FaCrown,
  FaExclamationTriangle,
  FaInfo,
} from "oh-vue-icons/icons";
import { OhVueIcon, addIcons } from "oh-vue-icons";

import { User } from "@/entities/entities";

import App from "@/App.vue";

import HomePage from "@/pages/HomePage/HomePage.vue";
import LobbyPage from "@/pages/LobbyPage/LobbyPage.vue";
import LobbyRoomPage from "@/pages/LobbyRoomPage/LobbyRoomPage.vue";
import CreateRoomPage from "@/pages/CreateRoomPage/CreateRoomPage.vue";
import LoginPrivateRoomPage from "@/pages/LoginPrivateRoomPage/LoginPrivateRoomPage.vue";
import GamePage from "@/pages/GamePage/GamePage.vue";
import ScorePage from "@/pages/ScorePage/ScorePage.vue";

import { useSessionStorage } from "@/hooks/useSessionStorage";
import { useUserStore } from "@/stores/user/user";

import "@/style.css";

addIcons(FaCrown);
addIcons(FaInfo);
addIcons(FaBug);
addIcons(FaExclamationTriangle);

const routes = [
  { path: "/", component: HomePage, name: "homepage" },
  {
    path: "/lobby",
    component: LobbyPage,
    name: "lobbypage",
  },
  {
    path: "/room/create",
    component: CreateRoomPage,
    name: "createroompage",
  },
  {
    path: "/room/lobby/:id",
    component: LobbyRoomPage,
    name: "lobbyroompage",
  },
  {
    path: "/room/login/private",
    component: LoginPrivateRoomPage,
    name: "roomloginprivatepage",
  },
  {
    path: "/game",
    component: GamePage,
    name: "gamepage",
  },
  {
    path: "/score",
    component: ScorePage,
    name: "scorepage",
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { handleGetItem, handleRemoveItem } = useSessionStorage();

  const sessionUser = handleGetItem<User>("user");
  const userStore = useUserStore();

  if (sessionUser && !userStore.username) {
    handleRemoveItem("user");
  }

  if (to.name !== "homepage" && !userStore.username) {
    return { name: "homepage" };
  }
});

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .component("v-icon", OhVueIcon)
  .mount("#app");
