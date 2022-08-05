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

// note: explore better typeing? trying to get from an untyped const
// to an inferred type so e.g. navigationContainers['this-is-not-a-obj-key'] can be avoided.
export type NavigationContainerName = keyof typeof navigationContainers;
export interface NavigationContainer {
  direction: "row" | "column";
  parent: string;
  position: number;
}
interface NavigationContainers {
  [index: string]: NavigationContainer;
}

// #TODO: write a validation test to ensure the heirarchy is valid,
// so like positions and parents don't have errors.
export const navigationContainers: NavigationContainers = {
  root: {
    direction: "row",
    parent: "root",
    position: -1,
  },
  abc: {
    direction: "row",
    parent: "root",
    position: 0,
  },
  onetwothree: {
    direction: "column",
    parent: "root",
    position: 1,
  },
  leftright: {
    direction: "row",
    parent: "root",
    position: 2,
  },
  "group-a": {
    direction: "row",
    parent: "root",
    position: 3,
  },
  aoneatwoathreeafour: {
    direction: "column",
    parent: "group-a",
    position: 0,
  },
  "group-b": {
    direction: "column",
    parent: "group-a",
    position: 1,
  },
  boneabtwob: {
    direction: "row",
    parent: "group-b",
    position: 0,
  },
};

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
