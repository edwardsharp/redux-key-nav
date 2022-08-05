import { nextItem, onSelect } from "./navigationSlice";
import { useCallback, useEffect } from "react";

import Button from "./Button";
import ButtonGroup from "./ButtonGroup";
import { useAppDispatch } from "../app/hooks";

export default function Nav() {
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
      dispatch(onSelect("hey"));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <>
      <ButtonGroup containerId="abc">
        <Button name="a" initialFocus>
          <span>A</span>
        </Button>
        <Button name="b">
          <span>B</span>
        </Button>
        <Button name="c">
          <span>C</span>
        </Button>
      </ButtonGroup>

      <ButtonGroup containerId="onetwothree">
        <Button name="one">
          <span>One</span>
        </Button>
        <Button name="two">
          <span>Two</span>
        </Button>
        <Button name="three">
          <span>Three</span>
        </Button>
        <Button name="four">
          <span>Four</span>
        </Button>
      </ButtonGroup>

      <ButtonGroup containerId="leftright">
        <Button name="left">
          <span>Left</span>
        </Button>
        <Button name="right">
          <span>Right</span>
        </Button>
      </ButtonGroup>

      <b>nested</b>

      <ButtonGroup containerId="group-a">
        <ButtonGroup containerId="aoneatwoathreeafour">
          <Button name="a one">
            <span>A One</span>
          </Button>
          <Button name="a tow">
            <span>A Two</span>
          </Button>
          <Button name="a three">
            <span>A Three</span>
          </Button>
          <Button name="a four">
            <span>A Four</span>
          </Button>
        </ButtonGroup>

        <ButtonGroup containerId="group-b">
          <ButtonGroup containerId="boneabtwob">
            <Button name="b one a">
              <span>B One A</span>
            </Button>
            <Button name="b two b">
              <span>B Two B</span>
            </Button>
          </ButtonGroup>

          <Button name="b two">
            <span>B Two</span>
          </Button>
          <Button name="b three">
            <span>B Three</span>
          </Button>
          <Button name="b four">
            <span>B Four</span>
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </>
  );
}
