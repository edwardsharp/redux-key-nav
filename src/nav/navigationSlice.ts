import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

import { RootState } from "../app/store";

interface NavigationContainer {
  id: string;
  parent: string;
  direction: "row" | "column";
  position: number;
  items: NavigationItems;
  elements: NavigationElement[];
}

interface NavigationElement {
  id: string;
  containerId: string;
  position: number;
  initialFocus?: boolean;
  parent?: string;
  containerDirection?: "row" | "column"; // hmm, not great to have this here, deal with this later.
  name?: string; // making debug'n a lil' easier right now.
}

type NavigationItems = NavigationContainer[];

type NextDirection = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export interface NavigationState {
  items: NavigationItems;
  activeElement?: NavigationElement;
}

const initialState: NavigationState = {
  items: [
    {
      id: "root",
      parent: "root",
      direction: "column",
      position: 0,
      items: [],
      elements: [],
    },
  ],
};

function iterateItems(
  items: NavigationItems,
  id: string,
  cb: (container: NavigationContainer) => void
) {
  for (const container of items) {
    if (container.id === id) {
      cb(container);
      break;
    }
    if (container.items.length) {
      iterateItems(container.items, id, cb);
    }
  }
}

function findContainer(
  items: NavigationItems,
  id: string,
  cb: (container: NavigationContainer) => NavigationContainer | undefined
): NavigationContainer | undefined {
  for (const container of items) {
    if (container.id === id) {
      return cb(container);
    }
    if (container.items.length) {
      return findContainer(container.items, id, cb);
    }
  }
}

function defaultContainer(
  id: string,
  container?: Partial<NavigationContainer>
): NavigationContainer {
  return {
    // it's not great to use default root parent, here :/
    parent: "root",
    position: 0,
    direction: "row",
    elements: [],
    items: [],
    ...container,
    id,
  };
}

function containerExists(items: NavigationItems, id: string) {
  let foundContainer: boolean = false;
  iterateItems(items, id, (c) => (foundContainer = true));
  return foundContainer;
}

function insertContainer(
  container: NavigationContainer,
  items: NavigationItems
) {
  if (containerExists(items, container.id)) {
    iterateItems(items, container.id, (c) => {
      // #TODO :/
      // so this might not be great, if the parent changes would need to move
      // this container obj in the hierarchy (rather than simply updating the `parent` attr)
      // this might not be doing the right thing, here. RECONSIDER
      c = {
        ...container,
        items: c.items,
        elements: c.elements,
      };
    });
  } else {
    iterateItems(items, container.parent, (c) => c.items.push(container));
  }

  return items;
}

function removeContainer(id: string, items: NavigationItems) {
  iterateItems(
    items,
    id,
    (c) => (c.items = c.items.filter((item) => item.id !== id))
  );
  return items;
}

function insertElement(
  element: NavigationElement,
  items: NavigationItems
): NavigationItems {
  // take care to insert a new (default) container if one does not yet exist.
  if (!containerExists(items, element.containerId)) {
    insertContainer(
      defaultContainer(element.containerId, {
        parent: element.parent,
        direction: element.containerDirection,
      }),
      items
    );
  }
  iterateItems(items, element.containerId, (c) => {
    if (c.elements.some((el) => el.id === element.id)) {
      // #TODO: something meaningful?
    } else {
      c.elements.push(element);
    }
  });
  return items;
}

function getNextElement(
  activeElement: NavigationElement | undefined,
  items: NavigationItems,
  direction: NextDirection
): NavigationElement | null | undefined {
  if (!activeElement) {
    return null;
  }

  const container = findContainer(items, activeElement.containerId, (c) => c);

  if (container) {
    const elementIdx = container.elements.findIndex((el) => {
      return el.id === activeElement.id;
    });

    switch (direction) {
      case "ArrowUp":
        if (
          container.direction === "column" &&
          container.elements[elementIdx - 1]
        ) {
          return container.elements[elementIdx - 1];
        } else {
          let nextIdx = -1;
          const prevContainer = findContainer(
            items,
            activeElement.containerId,
            (c) => {
              const idx = items.indexOf(c);
              nextIdx = Math.max(0, idx - 1);
              if (items[nextIdx]) {
                return items[nextIdx];
              }
            }
          );
          if (prevContainer) {
            return prevContainer.items[nextIdx].elements[0];
          }
        }
        break;
      case "ArrowDown":
        if (
          container.direction === "column" &&
          container.elements[elementIdx + 1]
        ) {
          return container.elements[elementIdx + 1];
        } else {
          let nextIdx = -1;
          const nextContainer = findContainer(
            items,
            activeElement.containerId,
            (c) => {
              const idx = items.indexOf(c);
              nextIdx = idx + 1;
              if (items[nextIdx]) {
                return items[nextIdx];
              }
            }
          );
          if (nextContainer) {
            return nextContainer.items[nextIdx + 1].elements[0];
          }
        }

        break;
      case "ArrowLeft":
        if (
          container.direction === "row" &&
          container.elements[elementIdx - 1]
        ) {
          return container.elements[elementIdx - 1];
        }
        break;
      case "ArrowRight":
        if (
          container.direction === "row" &&
          container.elements[elementIdx + 1]
        ) {
          return container.elements[elementIdx + 1];
        }
        break;
    }
  }
}

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    // #TODO: look into https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions
    registerContainer: (state, action: PayloadAction<NavigationContainer>) => {
      state.items = insertContainer(action.payload, state.items);
    },
    registerElement: (state, action: PayloadAction<NavigationElement>) => {
      state.items = insertElement(action.payload, state.items);
      if (!state.activeElement && action.payload.initialFocus) {
        state.activeElement = action.payload;
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      state.items = removeContainer(action.payload, state.items);
    },
    nextElement: (state, action: PayloadAction<NextDirection>) => {
      const nextElement = getNextElement(
        state.activeElement,
        state.items,
        action.payload
      );

      console.log(
        "nextElement:",
        nextElement ? current(nextElement) : "NOTHING!"
      );
      if (nextElement && state.activeElement !== nextElement) {
        state.activeElement = nextElement;
      }
    },
  },
});

export const { registerContainer, registerElement, remove, nextElement } =
  navigationSlice.actions;

// this needs and id arg to avoid rendering all buttons on each activeElement change...
// like:
/*
const selectItemsByCategory = createSelector(
  [
    // Usual first input - extract value from `state`
    state => state.items,
    // Take the second arg, `category`, and forward to the output selector
    (state, category) => category
  ],
  // Output selector gets (`items, category)` as args
  (items, category) => items.filter(item => item.category === category)
)
*/
export const selectActiveElement = (state: RootState) =>
  state.navigation.activeElement;

export default navigationSlice.reducer;
