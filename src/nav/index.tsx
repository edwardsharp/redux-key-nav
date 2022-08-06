import Button from "./Button";
import ButtonGroup from "./ButtonGroup";
import { useNavigationKeys } from "./navigation.hooks";

export default function Nav() {
  useNavigationKeys();

  return (
    <>
      <ButtonGroup name="abc">
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

      <ButtonGroup name="onetwothree">
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

      <ButtonGroup name="leftright">
        <Button name="left">
          <span>Left</span>
        </Button>
        <Button name="right">
          <span>Right</span>
        </Button>
      </ButtonGroup>

      <b>nested</b>

      <ButtonGroup name="threecol">
        <ButtonGroup name="threecola">
          <Button name="threecolaone">
            <span>A One</span>
          </Button>
          <Button name="threecolatwo">
            <span>A Two</span>
          </Button>
          <Button name="threecolathree">
            <span>A Three</span>
          </Button>
          <Button name="threecolafour">
            <span>A Four</span>
          </Button>
        </ButtonGroup>
        <ButtonGroup name="threecolb">
          <Button name="twocalbone">
            <span>B One</span>
          </Button>
          <Button name="twocalbtwo">
            <span>B Two</span>
          </Button>
          <Button name="twocalbthree">
            <span>B hree</span>
          </Button>
          <Button name="twocalbfour">
            <span>B Four</span>
          </Button>
        </ButtonGroup>

        <ButtonGroup name="threecolc">
          <Button name="threecolcone">
            <span>C One</span>
          </Button>
          <Button name="threecolctwo">
            <span>C Two</span>
          </Button>
          <Button name="threecolcthree">
            <span>C Three</span>
          </Button>
          <Button name="threecolcfour">
            <span>C Four</span>
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      <ButtonGroup name="group-a">
        <ButtonGroup name="aoneatwoathreeafour">
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

        <ButtonGroup name="group-b">
          <ButtonGroup name="boneabtwob">
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
