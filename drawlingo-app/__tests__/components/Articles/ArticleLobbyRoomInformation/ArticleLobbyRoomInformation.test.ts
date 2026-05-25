import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";

import ArticleLobbyRoomInformation from "@/components/Articles/ArticleLobbyRoomInformation/ArticleLobbyRoomInformation.vue";

const renderComponent = (roomState: Record<string, unknown> = {}): RenderResult => {
  return render(ArticleLobbyRoomInformation, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "room-xyz-456",
              configuration: {
                name: "",
                password: "",
                rounds: { actualRound: 1, totalRounds: 1 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "", username: "", actualRoom: "" },
              players: [],
              started: false,
              wordToGuess: {
                actualWord: "",
                wordsToChoose: [],
                wordWithPlaceholder: "",
              },
              ...roomState,
            },
          },
        }),
      ],
    },
  });
};

describe("ArticleLobbyRoomInformation", () => {
  it("should render the room id", () => {
    renderComponent();

    expect(screen.getByText("room-xyz-456")).toBeTruthy();
  });

  it("should render the ROOM ID label", () => {
    renderComponent();

    expect(screen.getByText("ROOM ID:")).toBeTruthy();
  });

  it("should render with a different room id", () => {
    renderComponent({ id: "custom-room-id" });

    expect(screen.getByText("custom-room-id")).toBeTruthy();
  });
});
