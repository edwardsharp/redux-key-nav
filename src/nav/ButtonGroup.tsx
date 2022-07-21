import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
} from "react";
import { registerContainer, remove } from "./navigationSlice";

import Stack from "@mui/material/Stack";
import { useAppDispatch } from "../app/hooks";

interface ButtonGroupProps {
  direction: "row" | "column";
  parent: string;
  position: number;
  children: ReactNode;
  containerId?: string;
}

export default function ButtonGroup(props: ButtonGroupProps) {
  const { direction, parent, position, children } = props;
  const dispatch = useAppDispatch();
  const groupId = useId();
  const id = props.containerId || groupId;

  // TODO, prolly should be a context here because children will render first.
  // and thus not have the correct parent.
  // <Button>s that registerElement() will be a context consumer to get parent container info.
  useEffect(() => {
    // console.log("gonna registerContainer:", {
    //   parent,
    //   id,
    //   position,
    //   direction,
    // });
    dispatch(
      registerContainer({
        parent,
        id,
        position,
        direction,
        elements: [],
        items: [],
      })
    );
    return () => {
      // console.log("need to remove container!!", id);
      dispatch(remove(id));
    };
  }, []);

  return (
    <Stack spacing={2} margin={1} direction={direction}>
      <b>{direction}</b>
      {Children.map(children, (child, idx) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            position: idx,
            parent: id,
            containerParent: parent,
            containerDirection: direction,
          });
        }
        return null;
      })}
    </Stack>
  );
}
