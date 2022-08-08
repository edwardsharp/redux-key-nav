import { ReactNode, useCallback, useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";
import { NavigationContainerName } from "../../lib/navigation/navigation";
import { onExitContainer } from "../../lib/navigation/navigationSlice";
import { useAppDispatch } from "../../app/hooks";
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
  containerId?: NavigationContainerName;
}) {
  const containerId = props.containerId || "popover1";
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

function DialogOne(props: {
  onClose: () => void;
  open: boolean;
  handleOpenDialogTwo: () => void;
  exitToContainer: NavigationContainerName;
}) {
  const { open, handleOpenDialogTwo, exitToContainer } = props;

  const dispatch = useAppDispatch();
  const onClose = () => {
    props.onClose();
    dispatch(onExitContainer(exitToContainer));
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Example Dialog One</DialogTitle>
      <SimpleButton name="dialog-button-0" position={0} focusOnMount>
        button 0
      </SimpleButton>
      <SimpleButton
        name="dialog-button-1"
        position={1}
        onSelect={handleOpenDialogTwo}
      >
        open another popover
      </SimpleButton>
      <SimpleButton name="dialog-button-2" position={2}>
        button 2
      </SimpleButton>
    </Dialog>
  );
}

function DialogTwo(props: {
  onClose: () => void;
  open: boolean;
  exitToContainer: NavigationContainerName;
}) {
  const { open, exitToContainer } = props;

  const dispatch = useAppDispatch();
  const onClose = () => {
    props.onClose();
    dispatch(onExitContainer(exitToContainer));
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Example Dialog Two</DialogTitle>
      <SimpleButton
        name="dialog-two-button-0"
        position={0}
        containerId="popover2"
        focusOnMount
      >
        button 0
      </SimpleButton>
      <SimpleButton
        name="dialog-two-button-1"
        position={1}
        containerId="popover2"
      >
        button 1
      </SimpleButton>
      <SimpleButton
        name="dialog-two-button-2"
        position={2}
        containerId="popover2"
      >
        button 2
      </SimpleButton>
    </Dialog>
  );
}

export default function Popovers(props: { onClose: () => void }) {
  const [dialogOneOpen, setDialogOneOpen] = useState(false);

  const handleOpenDialogOne = () => {
    setDialogOneOpen(true);
  };

  const handleCloseDialogOne = () => {
    setDialogOneOpen(false);
  };

  const [dialogTwoOpen, setDialogTwoOpen] = useState(false);

  const handleOpenDialogTwo = () => {
    setDialogTwoOpen(true);
  };

  const handleCloseDialogTwo = () => {
    setDialogTwoOpen(false);
  };

  return (
    <div>
      <ExitButton onSelect={props.onClose} />
      <PopoverButton onSelect={handleOpenDialogOne} />
      <DialogOne
        onClose={handleCloseDialogOne}
        open={dialogOneOpen}
        handleOpenDialogTwo={handleOpenDialogTwo}
        exitToContainer={"popovers"}
      />
      <DialogTwo
        onClose={handleCloseDialogTwo}
        open={dialogTwoOpen}
        exitToContainer={"popover1"}
      />
    </div>
  );
}
