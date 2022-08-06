/* note: this file could be broken down into 2/3 files:
 index.d.ts for interfaces and types
 navigationContainers should probably live along-side application code (not here, which is more like a lib)
 navigationEvents.ts for simple pub/sub thing
*/

export interface NavigationItem {
  id: string;
  container: NavigationContainer;
  containerId: NavigationContainerName;
  position: number;
  initialFocus?: boolean;
  name?: string; // making debug'n a lil' easier right now.
}

// #TODO: explore better types? this might be a little weird.
export type NavigationContainerName = keyof typeof defs;
interface NavigationContainerDefs {
  [index: string]: NavigationContainer;
}

type NavigationContainers = {
  [Property in NavigationContainerName]: NavigationContainer;
};

export interface NavigationContainer {
  direction: "row" | "column";
  exits?: {
    north?: NavigationContainerName;
    south?: NavigationContainerName;
    east?: NavigationContainerName;
    west?: NavigationContainerName;
  };
}

// #TODO: write a validation test to ensure the heirarchy is valid,
// so like positions and parents don't have errors.
const defs: NavigationContainerDefs = {
  root: {
    direction: "row",
  },

  abc: {
    direction: "row",
    exits: {
      south: "onetwothree",
    },
  },

  onetwothree: {
    direction: "column",
    exits: {
      north: "abc",
      south: "leftright",
    },
  },

  leftright: {
    direction: "row",
    exits: {
      north: "onetwothree",
      south: "threecol",
    },
  },

  threecol: {
    direction: "row",
    exits: {
      north: "threecola",
      south: "threecola",
    },
  },
  threecola: {
    direction: "column",
    exits: {
      north: "leftright",
      east: "threecolb",
      south: "group-a",
    },
  },
  threecolb: {
    direction: "column",
    exits: {
      north: "leftright",
      east: "threecolc",
      west: "threecola",
      south: "group-a",
    },
  },
  threecolc: {
    direction: "column",
    exits: {
      north: "leftright",
      west: "threecolb",
      south: "group-a",
    },
  },

  "group-a": {
    direction: "row",
    exits: {
      north: "threecol",
      south: "aoneatwoathreeafour",
    },
  },
  aoneatwoathreeafour: {
    direction: "column",
    exits: {
      north: "group-a",
      east: "boneabtwob",
    },
  },
  "group-b": {
    direction: "column",
    exits: {
      north: "boneabtwob",
      west: "aoneatwoathreeafour",
    },
  },
  boneabtwob: {
    direction: "row",
    exits: {
      north: "group-a",
      south: "group-b",
      west: "aoneatwoathreeafour",
    },
  },
};

export const navigationContainers = defs as NavigationContainers;

/*
simple pub/sub

use like:
navigationEvents.publish('topicId', 'hey');

const subscription = navigationEvents.subscribe('topidId', (str) => {
	// do something meaningful when the event happens.
});
// ...sometime later stop subscription:
subscription.remove();
*/

export const navigationEvents = (function () {
  const topics: { [index: string]: Array<(arg: string | undefined) => void> } =
    {};
  const hop = topics.hasOwnProperty;

  return {
    subscribe: function (
      topic: string,
      listener: (arg: string | undefined) => void
    ) {
      // add the topic if not yet created
      if (!hop.call(topics, topic)) topics[topic] = [];

      // add the listener cb to queue
      const index = topics[topic].push(listener) - 1;

      return {
        remove: function () {
          delete topics[topic][index];
        },
      };
    },
    publish: function (topic: string, info?: string) {
      // bail if there's no topic or no listener callbacks
      if (!hop.call(topics, topic)) return;

      for (const cb of topics[topic]) {
        cb && cb(info);
      }
    },
  };
})();
