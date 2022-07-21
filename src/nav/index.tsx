import { useCallback, useEffect } from "react";

import Button from "./Button";
import ButtonGroup from "./ButtonGroup";
import { nextElement } from "./navigationSlice";
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
      dispatch(nextElement(e.key));
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
      <ButtonGroup direction="row" parent="root" containerId="abc" position={0}>
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

      <ButtonGroup
        direction="column"
        parent="root"
        containerId="onetwothree"
        position={1}
      >
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

      <ButtonGroup
        direction="row"
        parent="root"
        containerId="leftright"
        position={2}
      >
        <Button name="left">
          <span>Left</span>
        </Button>
        <Button name="right">
          <span>Right</span>
        </Button>
      </ButtonGroup>

      <b>nested</b>

      <ButtonGroup
        direction="row"
        parent="root"
        containerId="group-a"
        position={3}
      >
        <ButtonGroup
          direction="column"
          parent="group-a"
          containerId="aoneatwoathreeafour"
          position={0}
        >
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

        <ButtonGroup
          direction="column"
          parent="group-a"
          containerId="group-b"
          position={1}
        >
          <ButtonGroup
            direction="row"
            parent="group-b"
            containerId="boneabtwob"
            position={0}
          >
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
