import { NavigationItem, navigationEvents } from "./navigation";
import {
  PayloadAction,
  createSelector,
  createSlice,
  current,
} from "@reduxjs/toolkit";

import { RootState } from "../app/store";

type NavigationItems = NavigationItem[];
type ActiveElement = NavigationItem | undefined | null;

type NextDirection = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

interface NavigationState {
  items: NavigationItems;
  activeElement: ActiveElement;
}

const initialState: NavigationState = {
  items: [],
  activeElement: null,
};

function getNextItem(
  state: NavigationState,
  direction: NextDirection
): NavigationItem | null | undefined {
  const { activeElement, items } = state;

  if (!activeElement) {
    return items[0];
  }

  const containerItems = items.filter(
    (i) => i.containerId === activeElement.containerId
  );

  // #TODO: .sort() anything filter()'d

  const container = activeElement.container;
  const itemIdx = containerItems.findIndex((i) => i.id === activeElement.id);

  switch (direction) {
    case "ArrowUp":
      if (container.direction === "column" && containerItems[itemIdx - 1]) {
        return containerItems[itemIdx - 1];
      } else {
        const prevContainerItems = items.filter(
          (i) => i.container.position === activeElement.container.position - 1
        );
        if (prevContainerItems[prevContainerItems.length - 1]) {
          return prevContainerItems[prevContainerItems.length - 1];
        }
      }
      break;
    case "ArrowDown":
      if (container.direction === "column" && containerItems[itemIdx + 1]) {
        return containerItems[itemIdx + 1];
      } else {
        const nextContainerItems = items.filter(
          (i) => i.container.position === activeElement.container.position + 1
        );
        if (nextContainerItems[0]) {
          return nextContainerItems[0];
        }
      }
      break;
    case "ArrowLeft":
      if (container.direction === "row" && containerItems[itemIdx - 1]) {
        return containerItems[itemIdx - 1];
      }
      break;
    case "ArrowRight":
      if (container.direction === "row" && containerItems[itemIdx + 1]) {
        return containerItems[itemIdx + 1];
      }
      break;
  }

  return null;
}

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    insert: (state, action: PayloadAction<NavigationItem>) => {
      state.items.push(action.payload);
      if (!state.activeElement && action.payload.initialFocus) {
        state.activeElement = action.payload;
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id === action.payload);
      // #TODO: check if this is the activeElement and if so set null
    },
    nextItem: (state, action: PayloadAction<NextDirection>) => {
      const nextElement = getNextItem(state, action.payload);

      console.log(
        "nextElement:",
        nextElement ? current(nextElement) : "NOTHING!"
      );
      if (nextElement && state.activeElement?.id !== nextElement.id) {
        state.activeElement = nextElement;
      }
    },
    onSelect: (state, action: PayloadAction<string>) => {
      if (state.activeElement) {
        navigationEvents.publish(state.activeElement.id, action.payload);
      }
    },
  },
});

export const { insert, remove, nextItem, onSelect } = navigationSlice.actions;

export const selectActiveElement = (state: RootState) =>
  state.navigation.activeElement;

export const selectIsActiveElement = createSelector(
  [(state: RootState) => state.navigation.activeElement, (_, id) => id],
  (activeElement, id: string) => {
    return !!activeElement && activeElement.id === id;
  }
);

export default navigationSlice.reducer;
