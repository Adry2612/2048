import { Tile } from "@/models/Tile";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { act, renderHook } from "@testing-library/react";
import { isNil } from "lodash";
import { useReducer } from "react";

describe("game-reducer", () => {
  describe("clean up", () => {
    it("should clean up the board from unused tiles", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [0, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
        dispatch({ type: "move_up" });
      });

      const [stateBefore] = result.current;
      expect(Object.values(stateBefore.tiles)).toHaveLength(2);
      expect(Object.values(stateBefore.tilesByIds)).toHaveLength(2);

      act(() => dispatch({ type: "clean_up" }));

      const [stateAfter] = result.current;
      expect(Object.values(stateAfter.tiles)).toHaveLength(1);
      expect(Object.values(stateAfter.tilesByIds)).toHaveLength(1);
    });
  });
  describe("create_tile", () => {
    it("should create a new tile on the board", () => {
      const tile: Tile = { position: [0, 0], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => dispatch({ type: "create_tile", tile }));
      const [state] = result.current;
      const tileId = state.board[0][0];

      expect(tileId).toBeDefined();
      expect(Object.values(state.tiles)).toEqual([{ id: tileId, ...tile }]);
      expect(state.tilesByIds).toEqual([tileId]);
    });
  });

  describe("move up", () => {
    it("should move tiles up of the board", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });
      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[0][0]).toBe("string");
      expect(typeof stateAfter.board[0][1]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same value on top of each other", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [0, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });
      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[3][0]).toBe("string");

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[0][0]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
    });

    it("should merge tiles with the same value", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [0, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });
      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[3][0]].value).toBe(2);

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(stateAfter.tiles[stateAfter.board[0][0]].value).toBe(4);

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
    });
  });

  describe("move down", () => {
    it("should move tiles down of the board", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");

      expect(isNil(stateBefore.board[2][1])).toBeTruthy();
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(typeof stateAfter.board[3][1]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
    });

    it("should stack tiles with the same value on top of each other", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(typeof stateAfter.board[3][1]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
    });

    it("should merge tiles with the same value", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [0, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[3][0]].value).toBe(2);

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(isNil(stateAfter.board[0][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(stateAfter.tiles[stateAfter.board[3][0]].value).toBe(4);
    });
  });

  describe("move left", () => {
    it("should move tiles to the left side of the board", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });
      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(typeof stateAfter.board[3][0]).toBe("string");

      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same value on top of each other", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(typeof stateAfter.board[3][0]).toBe("string");

      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should merge tiles with the same value", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [3, 1], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);
      expect(isNil(stateBefore.board[1][1])).toBeTruthy();
      expect(isNil(stateBefore.board[1][2])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[1][3]].value).toBe(2);

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(isNil(stateAfter.board[1][1])).toBeTruthy();
      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(isNil(stateAfter.board[1][3])).toBeTruthy();
    });
  });

  describe("move right", () => {
    it("should move tiles to the right side of the board", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });
      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_right" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][3]).toBe("string");
      expect(typeof stateAfter.board[3][3]).toBe("string");

      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same value on top of each other", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [1, 3], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_right" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[3][3]).toBe("string");
      expect(typeof stateAfter.board[3][3]).toBe("string");

      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should merge tiles with the same value", () => {
      const tileOne: Tile = { position: [0, 1], value: 2 };
      const tileTwo: Tile = { position: [3, 1], value: 2 };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tileOne });
        dispatch({ type: "create_tile", tile: tileTwo });
      });

      const [stateBefore] = result.current;
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);
      expect(isNil(stateBefore.board[1][1])).toBeTruthy();
      expect(isNil(stateBefore.board[1][2])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[1][3]].value).toBe(2);

      act(() => dispatch({ type: "move_right" }));

      const [stateAfter] = result.current;
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][1])).toBeTruthy();
      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(stateAfter.tiles[stateAfter.board[1][3]].value).toBe(4);
    });
  });
});
