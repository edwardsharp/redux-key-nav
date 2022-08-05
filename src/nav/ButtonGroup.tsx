import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useId,
} from "react";
import { NavigationContainerName, navigationContainers } from "./navigation";

import Stack from "@mui/material/Stack";

interface ButtonGroupProps {
  containerId: NavigationContainerName;
  children: ReactNode;
}

export default function ButtonGroup(props: ButtonGroupProps) {
  const { children } = props;
  const groupId = useId();
  const id = props.containerId || groupId;

  const container = navigationContainers[props.containerId];

  return (
    <Stack spacing={2} margin={1} direction={container.direction}>
      <b>{container.direction}</b>
      {Children.map(children, (child, idx) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            position: idx,
            containerId: id,
          });
        }
        return null;
      })}
    </Stack>
  );
}
