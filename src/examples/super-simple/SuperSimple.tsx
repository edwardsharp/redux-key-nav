import { ReactNode, useCallback } from "react";

import { useNavigation } from "../../lib/navigation/navigation.hooks";

const containerId = "supersimple";

function SimpleButton(props: {
  name: string;
  position: number;
  children: ReactNode;
  onSelect?: () => void;
  initialFocus?: boolean;
}) {
  const { children, name, initialFocus, position } = props;

  const onSelect = useCallback((arg?: string) => {
    console.log(name, "got event! arg:", arg);
    props.onSelect && props.onSelect();
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position,
    containerId,
    initialFocus,
  });

  return (
    <button
      onClick={(e) => onSelect("on click!")}
      style={{
        borderColor: isActiveElement ? "#ff11ff" : "black",
        color: isActiveElement ? "#ff11ff" : "black",
        fontSize: "1em",
      }}
    >
      {children}
    </button>
  );
}

export default function SuperSimple(props: { onClose: () => void }) {
  return (
    <div>
      <SimpleButton
        position={0}
        name="super-simple-exit"
        onSelect={props.onClose}
        initialFocus
      >
        exit
      </SimpleButton>

      <SimpleButton position={1} name="super-simple-ohey">
        ohey!
      </SimpleButton>

      <SimpleButton position={2} name="super-simple-another-button">
        another button
      </SimpleButton>

      <SimpleButton position={3} name="super-simple-beep">
        beep
      </SimpleButton>

      <SimpleButton position={4} name="super-simple-boop">
        boop
      </SimpleButton>
    </div>
  );
}
