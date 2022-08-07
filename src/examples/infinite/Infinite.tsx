import "./infinite.css";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { useNavigation } from "../../lib/navigation/navigation.hooks";

function NavButton(props: {
  name: string;
  position: number;
  children: ReactNode;
  onSelect?: () => void;
  initialFocus?: boolean;
}) {
  const { children, name, initialFocus, position } = props;

  const onSelect = useCallback((arg?: string) => {
    console.log(name, "Infinite NavButton got event! arg:", arg);
    props.onSelect && props.onSelect();
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position,
    containerId: "infinitenav",
    initialFocus,
  });

  return (
    <button
      onClick={(e) => onSelect("on click!")}
      className={isActiveElement ? "active" : ""}
    >
      {children}
    </button>
  );
}

function SimpleButton(props: {
  name: string;
  position: number;
  children: ReactNode;
  onSelect?: () => void;
  onFocus?: (position: number) => void;
  initialFocus?: boolean;
}) {
  const { children, name, initialFocus, position } = props;

  const ref = useRef<HTMLButtonElement>(null);

  const onSelect = useCallback((arg?: string) => {
    console.log(name, "Infinite SimpleButton got event! arg:", arg);
    props.onSelect && props.onSelect();
  }, []);

  const { isActiveElement } = useNavigation({
    onSelect,
    name,
    position,
    containerId: "infiniteitems",
    initialFocus,
  });

  useEffect(() => {
    if (isActiveElement) {
      props.onFocus && props.onFocus(position);
      ref.current?.focus();
      // or like:
      // ref.current?.scrollIntoView();
    }
  }, [isActiveElement]);

  return (
    <button
      onClick={(e) => onSelect("on click!")}
      className={isActiveElement ? "active" : ""}
      ref={ref}
    >
      {children}
    </button>
  );
}

export default function Infinite(props: { onClose: () => void }) {
  const infiniteButton = (idx: number) => (
    <SimpleButton
      position={idx}
      name={`infinite${idx}`}
      key={`infinite${idx}`}
      onFocus={onFocus}
    >
      {idx} button
    </SimpleButton>
  );

  const [infiniteButtons, setInfiniteButtons] = useState<JSX.Element[]>([]);

  const onFocus = (position: number) => {
    setInfiniteButtons((prevButtons) => {
      if (position >= prevButtons.length - 2) {
        // push a new button when we get towards the end of the list.
        return [...prevButtons, infiniteButton(prevButtons.length)];
      } else {
        return prevButtons;
      }
    });
  };

  if (infiniteButtons.length === 0) {
    // initialize some buttons
    const btnz = [];
    for (let i = 0; i < 5; i++) {
      btnz.push(infiniteButton(i));
    }
    setInfiniteButtons(btnz);
  }

  return (
    <div>
      <NavButton
        position={0}
        name="infinite-exit"
        onSelect={props.onClose}
        initialFocus
      >
        exit
      </NavButton>

      <NavButton position={1} name="infinite-ohey">
        ohey!
      </NavButton>
      <NavButton position={2} name="infinite-ohey">
        ohey!
      </NavButton>

      <div className="column">{infiniteButtons}</div>
    </div>
  );
}
