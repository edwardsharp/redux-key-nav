import { Children, ReactNode, cloneElement, isValidElement } from "react";
import {
  NavigationContainerName,
  navigationContainers,
} from "../../lib/navigation/navigation";

import Stack from "@mui/material/Stack";

interface ButtonGroupProps {
  name: NavigationContainerName;
  children: ReactNode;
}

export default function ButtonGroup(props: ButtonGroupProps) {
  const { name, children } = props;
  const container = navigationContainers[name];

  return (
    <Stack spacing={2} margin={1} direction={container.direction}>
      <b>
        {name} {container.direction}
      </b>
      {Children.map(children, (child, idx) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            position: idx,
            containerId: name,
          });
        }
        return null;
      })}
    </Stack>
  );
}
