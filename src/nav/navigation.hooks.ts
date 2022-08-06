import {
  NavigationContainerName,
  NavigationEventListener,
  navigationContainers,
  navigationEvents,
} from "./navigation";
import {
  insert,
  nextItem,
  onSelect,
  remove,
  selectIsActiveElement,
} from "./navigationSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useCallback, useEffect, useId } from "react";

export const useNavigationKeys = () => {
  const dispatch = useAppDispatch();

  const onKeydown = useCallback((e: KeyboardEvent) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      dispatch(nextItem(e.key));
    }
    if (e.key === "Enter") {
      dispatch(onSelect("Enter key pressed!"));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);
};

export const useNavigation = (props: {
  onSelect: NavigationEventListener;
  name: string;
  position?: number;
  containerId?: NavigationContainerName;
  initialFocus?: boolean;
}) => {
  const { onSelect, name, initialFocus } = props;

  const dispatch = useAppDispatch();
  const id = useId();
  const isActiveElement = useAppSelector((state) =>
    selectIsActiveElement(state, id)
  );

  const containerId = props.containerId || "root";
  const position = props.position || 0;
  const container = navigationContainers[containerId];

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

    const subscription = navigationEvents.subscribe(id, onSelect);

    return () => {
      dispatch(remove(id));

      subscription.remove();
    };
  }, []);

  return { isActiveElement };
};
