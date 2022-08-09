# redux-key-nav

an opinionated proof-of-concept & demo for handling arrow key navigation in React + Redux apps.

**note:** this is very much a work in progress. this repo isn't currently intended to be a library or finished product but rather my own explorations in a particular problem space. may it be an inspiration for how you do (or don't) implement keyboard navigation in your own webapp.

## high-level goals & tradeoffs

1. avoid dynamic (auto-magical) inference of rendered artifacts (i.e. the DOM) **rather:** attempt to be explicit in declaring all navigable elements and their behavior.
2. avoid reading the DOM (querySelectors, getBoundingClientRect, etc.) **rather:** lean into Redux; try to align data flow to move in a single direction.
3. avoid trying to be an all-in-one, handles-every-use-case-library solution **rather:** lean into the particular needs, use cases, biz logic etc. of your application.
4. avoid black-box encapsulation **rather:** embrace extensibility for edge cases (but try to settle on sensible default behavior).

## overview

### 🧃 containers

a core tenant of this is to explicitly represent all the containers that will be used in the app. each container represents a single row or column of navigable items. containers can contain other containers. similar to how a flexbox handles rows and columns.

at the heart of this all is a definition of all the containers that will be used in the app. see: `navigationContainers` in [src/lib/navigation/navigation.ts](src/lib/navigation/navigation.ts). this is an object where keys represent the names of each unique container (`NavigationContainerName`) and a value that looks like:

```ts
interface NavigationContainer {
  direction: "row" | "column";
  exits?: {
    north?: NavigationContainerName;
    south?: NavigationContainerName;
    east?: NavigationContainerName;
    west?: NavigationContainerName;
  };
}
```

`row` correlates to left & right arrow keys and `column` to up and down. `exits` reference other containers that navigation move to next after reaching the boundary. for example suppose we have 6 buttons in two containers (one row and one column) like so:

```
┌──────────────────┐
│                  │ topContainer: {
│ ┌────┬─────┬───┐ │   direction: "row",
│ │  a │  b  │ c │ │   exits: { south: "mainContainer" }
│ └────┴─────┴───┘ │ },
│                  │
│ ┌──────────────┐ │
│ │    one       │ │ mainContainer: {
│ ├──────────────┤ │   direction: "column",
│ │    two       │ │   exits: { north: "topContainer" }
│ ├──────────────┤ │ }
│ │    three     │ │
│ └──────────────┘ │
│                  │
└──────────────────┘

```

left and right arrow keys will navigate between `a`, `b`, or `c` and the down arrow (when on any button in this row) will exit to `mainContainer` and here up and down arrows will navigate between `one`, `two`, and `three` buttons and the up arrow (when on button `one`) will exit to `topContainer`.

### 🪝 component hooks

`useNavigationKeys` [src/lib/navigation/navigation.hooks.ts](src/lib/navigation/navigation.hooks.ts) should be called once as far up the React component tree as possible ([App.tsx](src/App.tsx)). this is the global key event handler that dispatches events to move focus selection when arrow keys are pressed. it will also publish events (using a simple pub/sub abstraction) for `enter` key presses that will call the `onSelect` fn passed to `useNavigation` (this would typically be the `onClick` handler your button already uses).

`useNavigation` [src/lib/navigation/navigation.hooks.ts](src/lib/navigation/navigation.hooks.ts) can mixed into any navigable components like buttons, inputs, selects, etc. basically anything that has click (or other key/mouse) handlers. this hook will take care of registering items in the Redux store and subscribing to `enter` (or possibly other) key presses.

a very simple example would be like so:

```ts
function SimpleButton() {
  const { isActiveElement } = useNavigation({
    name: "a",
    position: 0,
    containerId: "topContainer",
    onSelect: (arg?: string) => {
      console.log("got event with arg:", arg);
    },
  });

  return (
    <button onClick={(e) => onSelect("on click!")}>
      {isActiveElement ? "an active" : "a"} button
    </button>
  );
}
```

### misc.

there's logic to handle more grid-like structures, so for example:

```
┌───────────────────────┐
│                       │
│ ┌────────┐ ┌────────┐ │
│ │   a    │ │  one   │ │
│ ├────────┤ ├────────┤ │
│ │   b    │ │  two   │ │
│ ├────────┤ ├────────┤ │
│ │   c    │ │  three │ │
│ └────────┘ └────────┘ │
│                       │
└───────────────────────┘
```

pressing the right arrow while on `a` will exit to `one`, `b` -> `two` and `c` -> `three` (as well as the inverse when pressing left in column 2 to get back to buttons on the same row in column 1).

`initialFocus` will cause that item to get set as the active item if there isn't already one.

`focusOnMount` will get set as the active item no matter if one already exists (see: [src/examples/popovers/Popovers.tsx](src/examples/popovers/Popovers.tsx)).

`onExitContainer` is intended to be used when there are two (or more) containers that are rendered but do not reference each other with their container's `exits` property. an example is a navigation trap like a modal dialog popup that renders atop the other navigation items but navigation should be constrained to that container (or containers) only and when the container is closed call back to `onExitContainer` with the container name that active focus should go to (see: [src/examples/popovers/Popovers.tsx](src/examples/popovers/Popovers.tsx)).

use a `ref` in order to call methods on the HTMLElement like `.focus()` when an item is focused (i.e. `useEffect(()=> ref.focus(), [activeItem])` or when enter (or whatever) key presses happen. see: [src/examples/infinite/Infinite.tsx](src/examples/infinite/Infinite.tsx)

please see [src/examples/](src/examples/) for more.
