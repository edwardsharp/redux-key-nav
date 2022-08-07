import { ReactNode, useCallback, useState } from "react";

import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";
import { useNavigation } from "../../lib/navigation/navigation.hooks";

function ExitButton(props: { onSelect: () => void }) {
  const containerId = "popovers";
  const name = "popovers-exit";
  const onSelect = useCallback((arg?: string) => {
    console.log(name, "Popovers ExitButton got event! arg:", arg);
    props.onSelect && props.onSelect();
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position: 0,
    containerId,
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
      exit
    </button>
  );
}

function PopoverButton(props: { onSelect: (arg?: string) => void }) {
  const containerId = "popovers";
  const name = "popovers-button";
  const onSelect = useCallback((arg?: string) => {
    console.log(name, "Popovers PopoverButton got event! arg:", arg);
    props.onSelect && props.onSelect(arg);
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position: 1,
    containerId,
    initialFocus: true,
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
      open popover
    </button>
  );
}

function SimpleButton(props: {
  name: string;
  position: number;
  children: ReactNode;
  onSelect?: () => void;
  initialFocus?: boolean;
  focusOnMount?: boolean;
}) {
  const containerId = "popover1";
  const { children, name, initialFocus, focusOnMount, position } = props;

  const onSelect = useCallback((arg?: string) => {
    console.log(name, "Popovers SimpleButton got event! arg:", arg);
    props.onSelect && props.onSelect();
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position,
    containerId,
    initialFocus,
    focusOnMount,
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

export default function Popovers(props: { onClose: () => void }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ExitButton onSelect={props.onClose} />
      <PopoverButton onSelect={handleClick} />
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Example Dialog</DialogTitle>
        <SimpleButton name="dialog-button-0" position={0} focusOnMount>
          button 0
        </SimpleButton>
        <SimpleButton name="dialog-button-1" position={1}>
          button 1
        </SimpleButton>
        <SimpleButton name="dialog-button-2" position={2}>
          button 2
        </SimpleButton>
      </Dialog>
    </div>
  );
}
