import Board from "@/components/Board";
import GameProvider, { GameContext } from "@/context/GameContext";
import { render } from "@testing-library/react";

describe("Board component", () => {
  it("should render board with 16 cells", () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>,
    );
    const cells = container.querySelectorAll(".cell");

    expect(cells).toHaveLength(16);
  });

  it("should render board with 2 tiles", () => {
    const { container } = render(
      <GameProvider>
        <Board />
      </GameProvider>,
    );
    const tiles = container.querySelectorAll(".tile");
    expect(tiles).toHaveLength(2);
  });
});
