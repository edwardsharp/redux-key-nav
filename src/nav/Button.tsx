import {
  NavigationContainerName,
  navigationContainers,
  navigationEvents,
} from "./navigation";
import { ReactNode, useEffect, useId } from "react";
import { insert, remove, selectIsActiveElement } from "./navigationSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Button as MUIButton } from "@mui/material";

interface ButtonProps {
  containerId?: NavigationContainerName;
  position?: number;
  children?: ReactNode;
  initialFocus?: boolean;
  name?: string; // helpful for debugging rn.
}

export default function Button(props: ButtonProps) {
  const { children, initialFocus, name } = props;
  const dispatch = useAppDispatch();
  const id = useId();
  const isActiveElement = useAppSelector((state) =>
    selectIsActiveElement(state, id)
  );

  const containerId = props.containerId || "root";
  const position = props.position || 0;
  const container = navigationContainers[containerId];

  // console.log(name, "rendered!");
  useEffect(() => {
    dispatch(
      insert({
        id,
        position,
        name,
        containerId,
        container,
        initialFocus,
      })
    );

    const subscription = navigationEvents.subscribe(id, (str) => {
      console.log(id, name, "got event!");
    });

    return () => {
      dispatch(remove(id));

      subscription.remove();
    };
  }, []);

  return (
    <MUIButton variant={isActiveElement ? "contained" : "outlined"}>
      {children}
      {id} {containerId} {position}
    </MUIButton>
  );
}
