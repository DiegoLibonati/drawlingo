import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

import { useSessionStorage } from "@/composables/useSessionStorage";

import { useUserStore } from "@/stores/useUserStore";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "homepage",
    component: async () => import("@/pages/HomePage/HomePage.vue"),
  },
  {
    path: "/lobby",
    name: "lobbypage",
    component: async () => import("@/pages/LobbyPage/LobbyPage.vue"),
  },
  {
    path: "/room/create",
    name: "createroompage",
    component: async () => import("@/pages/CreateRoomPage/CreateRoomPage.vue"),
  },
  {
    path: "/room/lobby/:id",
    name: "lobbyroompage",
    component: async () => import("@/pages/LobbyRoomPage/LobbyRoomPage.vue"),
  },
  {
    path: "/room/login/private",
    name: "roomloginprivatepage",
    component: async () => import("@/pages/LoginPrivateRoomPage/LoginPrivateRoomPage.vue"),
  },
  {
    path: "/game",
    name: "gamepage",
    component: async () => import("@/pages/GamePage/GamePage.vue"),
  },
  {
    path: "/score",
    name: "scorepage",
    component: async () => import("@/pages/ScorePage/ScorePage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { handleGetItem, handleRemoveItem } = useSessionStorage();

  const sessionUser = handleGetItem("user");
  const userStore = useUserStore();

  if (sessionUser && !userStore.username) {
    handleRemoveItem("user");
  }

  if (to.name !== "homepage" && !userStore.username) {
    return { name: "homepage" };
  }

  return undefined;
});

export default router;
