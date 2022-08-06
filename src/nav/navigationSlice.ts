import {
  NavigationContainerName,
  NavigationItem,
  navigationContainers,
  navigationEvents,
} from "./navigation";
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
interface LastActiveItemInContainer {
  [index: string]: string;
}
interface NavigationState {
  items: NavigationItems;
  activeElement: ActiveElement;
  lastActiveItemInContainer: LastActiveItemInContainer;
}

const initialState: NavigationState = {
  items: [],
  activeElement: null,
  lastActiveItemInContainer: {},
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

  // #TODO: maybe abstract each direction case into a single function to D.R.Y. this up? ¯\_(ツ)_/¯
  switch (direction) {
    case "ArrowUp":
      if (container.direction === "column" && containerItems[itemIdx - 1]) {
        // simple, if this a column and there's an navigationItem before this (activeElement) in the array, return it!
        return containerItems[itemIdx - 1];
      } else {
        // otherwise check if there's a container that we can exit to
        let nextExit: NavigationContainerName | undefined =
          activeElement.container.exits?.north;

        let prevContainerItems = items.filter(
          (i) => i.containerId === nextExit
        );

        // so if there's no items in this container, and the container has an exit
        // keep recursively going thru containers' exits until either there are items or no more exits.
        while (prevContainerItems.length === 0 && nextExit) {
          nextExit = navigationContainers[nextExit].exits?.north;
          console.log("gonna keep going north! nextExit:", nextExit);

          prevContainerItems = items.filter((i) => i.containerId === nextExit);
        }

        const lastActiveItem = prevContainerItems.find(
          (i) => nextExit && i.id === state.lastActiveItemInContainer[nextExit]
        );
        if (lastActiveItem) {
          return lastActiveItem;
        }

        if (prevContainerItems[prevContainerItems.length - 1]) {
          return prevContainerItems[prevContainerItems.length - 1];
        }
      }
      break;
    case "ArrowDown":
      if (container.direction === "column" && containerItems[itemIdx + 1]) {
        return containerItems[itemIdx + 1];
      } else {
        let nextExit: NavigationContainerName | undefined =
          activeElement.container.exits?.south;

        let nextContainerItems = items.filter(
          (i) => i.containerId === nextExit
        );

        while (nextContainerItems.length === 0 && nextExit) {
          nextExit = navigationContainers[nextExit].exits?.south;
          console.log("gonna keep going south! nextExit:", nextExit);

          nextContainerItems = items.filter((i) => i.containerId === nextExit);
        }

        const lastActiveItem = nextContainerItems.find(
          (i) => nextExit && i.id === state.lastActiveItemInContainer[nextExit]
        );
        if (lastActiveItem) {
          return lastActiveItem;
        }

        if (nextContainerItems[0]) {
          return nextContainerItems[0];
        }
      }
      break;
    case "ArrowLeft":
      if (container.direction === "row" && containerItems[itemIdx - 1]) {
        return containerItems[itemIdx - 1];
      } else {
        let nextExit: NavigationContainerName | undefined =
          activeElement.container.exits?.west;

        let prevContainerItems = items.filter(
          (i) => i.containerId === nextExit
        );

        while (prevContainerItems.length === 0 && nextExit) {
          nextExit = navigationContainers[nextExit].exits?.west;
          console.log("gonna keep going west! nextExit:", nextExit);

          prevContainerItems = items.filter((i) => i.containerId === nextExit);
        }

        const lastActiveItem = prevContainerItems.find(
          (i) => nextExit && i.id === state.lastActiveItemInContainer[nextExit]
        );
        if (lastActiveItem) {
          return lastActiveItem;
        }

        if (prevContainerItems[prevContainerItems.length - 1]) {
          return prevContainerItems[prevContainerItems.length - 1];
        }
      }

      break;
    case "ArrowRight":
      if (container.direction === "row" && containerItems[itemIdx + 1]) {
        return containerItems[itemIdx + 1];
      } else {
        let nextExit: NavigationContainerName | undefined =
          activeElement.container.exits?.east;

        let nextContainerItems = items.filter(
          (i) => i.containerId === nextExit
        );

        while (nextContainerItems.length === 0 && nextExit) {
          nextExit = navigationContainers[nextExit].exits?.east;
          console.log("gonna keep going east! nextExit:", nextExit);

          nextContainerItems = items.filter((i) => i.containerId === nextExit);
        }

        const lastActiveItem = nextContainerItems.find(
          (i) => nextExit && i.id === state.lastActiveItemInContainer[nextExit]
        );
        if (lastActiveItem) {
          return lastActiveItem;
        }

        if (nextContainerItems[nextContainerItems.length - 1]) {
          return nextContainerItems[nextContainerItems.length - 1];
        }
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
        state.lastActiveItemInContainer[nextElement.containerId] =
          nextElement.id;
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
