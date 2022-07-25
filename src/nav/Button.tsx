import { ReactNode, useEffect, useId } from "react";
import {
  registerElement,
  remove,
  selectActiveElement,
} from "./navigationSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Button as MUIButton } from "@mui/material";

interface ButtonProps {
  parent?: string;
  position?: number;
  children?: ReactNode;
  containerParent?: string;
  containerDirection?: "row" | "column";
  initialFocus?: boolean;
  name?: string; // helpful for debugging rn.
}

export default function Button(props: ButtonProps) {
  const { children, containerParent, containerDirection, initialFocus, name } =
    props;
  const dispatch = useAppDispatch();
  const activeElement = useAppSelector(selectActiveElement);
  const id = useId();
  const isActiveElement = activeElement && activeElement.id === id;
  const parent = props.parent || "root";
  const position = props.position || 0;

  console.log(name, "rendered!");
  useEffect(() => {
    // console.log("gonna registerElement:", {
    //   containerId: parent,
    //   id,
    //   position,
    // });
    dispatch(
      registerElement({
        containerId: parent,
        id,
        position,
        name,
        parent: containerParent,
        containerDirection,
        initialFocus,
      })
    );
    return () => {
      // console.log("need to remove element!", id);
      dispatch(remove(id));
    };
  }, []);

  return (
    <MUIButton variant={isActiveElement ? "contained" : "outlined"}>
      {children}
      --id:{id}--parent:{parent}-- pos:{position}
    </MUIButton>
  );
}
