import "./examples.css";

import { ReactNode, useCallback, useState } from "react";

import Infinite from "./infinite/Infinite";
import { NavigationEventListener } from "../lib/navigation/navigation";
import Nested from "./nested/Nested";
import Popovers from "./popovers/Popovers";
import SuperSimple from "./super-simple/SuperSimple";
import { useNavigation } from "../lib/navigation/navigation.hooks";

type Examples = "nested" | "super-simple" | "infinite" | "popovers";

const containerId = "exampleroot";

function ExampleItem(props: {
  name: string;
  position: number;
  onSelect: NavigationEventListener;
  children: ReactNode;
  initialFocus?: boolean;
}) {
  const { children, name, initialFocus, position } = props;

  const onSelect = useCallback((arg?: string) => {
    console.log(name, "got event! arg:", arg);
    props.onSelect && props.onSelect(arg);
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position,
    containerId,
    initialFocus,
  });

  return (
    <li
      onClick={(e) => onSelect("on click!")}
      className={isActiveElement ? "active" : ""}
    >
      {children}
    </li>
  );
}

export default function Examples() {
  const [example, setExample] = useState<Examples>();

  const onClose = () => setExample(undefined);
  switch (example) {
    case "nested":
      return <Nested onClose={onClose} />;
    case "super-simple":
      return <SuperSimple onClose={onClose} />;
    case "infinite":
      return <Infinite onClose={onClose} />;
    case "popovers":
      return <Popovers onClose={onClose} />;
    default:
      return (
        <ol>
          <ExampleItem
            position={0}
            name="example-super-simple"
            onSelect={() => setExample("super-simple")}
            initialFocus
          >
            super-simple
          </ExampleItem>

          <ExampleItem
            position={1}
            name="example-infinite-list"
            onSelect={() => setExample("infinite")}
          >
            infinite list
          </ExampleItem>

          <ExampleItem
            position={2}
            name="example-nested"
            onSelect={() => setExample("nested")}
          >
            nested
          </ExampleItem>

          <ExampleItem
            position={3}
            name="example-popovers"
            onSelect={() => setExample("popovers")}
          >
            popovers
          </ExampleItem>
        </ol>
      );
  }
}
