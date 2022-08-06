import { ReactNode, useCallback } from "react";

import { Button as MUIButton } from "@mui/material";
import { NavigationContainerName } from "./navigation";
import { useNavigation } from "./navigation.hooks";

interface ButtonProps {
  containerId?: NavigationContainerName;
  position?: number;
  children?: ReactNode;
  initialFocus?: boolean;
  name?: string; // helpful for debugging rn.
}

export default function Button(props: ButtonProps) {
  const { containerId, position, children, initialFocus } = props;
  const name = props.name || "noname";

  const onSelect = useCallback((arg?: string) => {
    console.log(name, "got event! arg:", arg);
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position,
    containerId,
    initialFocus,
  });

  return (
    <MUIButton
      variant={isActiveElement ? "contained" : "outlined"}
      onClick={(e) => onSelect("click!")}
      title={`containerId: ${containerId}`}
    >
      {children} [{position}]
    </MUIButton>
  );
}
