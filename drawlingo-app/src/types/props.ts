import type { InputTypeHTMLAttribute } from "vue";
import type { Player, User } from "@/types/app";

export interface MainLayoutProps {
  class: string;
  layoutType: "flex" | "grid";
}

export interface ButtonPrimaryProps {
  type: "button" | "submit" | "reset";
  class?: string;
  click?: () => void;
}

export interface ButtonSecondaryProps {
  type: "button" | "submit" | "reset";
  class?: string | string[];
  click?: () => void;
}

export interface ButtonGridTertiaryProps {
  click: () => void;
}

export interface ButtonGridTertiaryFullProps {
  click: () => void;
}

export interface CardLobbyProps {
  idRoom: string;
  totalSlots: number;
  usersInRoom: number;
  ownerRoom: User;
  nameRoom: string;
  typeRoom: string;
}

export interface CardPlayerGameProps {
  position: number;
  player: Player;
}

export interface CardPlayerScoreProps {
  position: number;
  player: Player;
}

export interface CardPlayerRoomLobbyProps {
  username: string;
  isOwner: boolean;
  class?: string;
}

export interface MessageChatProps {
  username: string;
  message: string;
  classUsername?: string;
}

export interface InputColorProps {
  modelValue: string;
  class?: string;
}

export interface InputRangeProps {
  modelValue: number;
  class?: string;
}

export interface InputSecondaryProps {
  id: string;
  placeholder: string;
  modelValue: string;
  type: InputTypeHTMLAttribute;
  class?: string;
}

export interface InputTransparentProps {
  id: string;
  placeholder: string;
  modelValue: string;
  labelValue?: string;
  class?: string;
}
