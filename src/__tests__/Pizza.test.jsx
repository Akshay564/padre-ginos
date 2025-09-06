import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Pizza from "../Pizza";

test("alt test renders on Pizza image", async () => {
  const name = "My favorite Pizza";
  const src = "https://picsum.photos/200";

  const screen = render(
    <Pizza name={name} description="super cool Pizza" image={src} />,
  );

  const image = screen.getByRole("img");
  expect(image.src).toBe(src);
  expect(image.alt).toBe(name);
});
