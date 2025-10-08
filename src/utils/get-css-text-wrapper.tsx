"use client";

import { getCssText } from "@ignite-ui/react";

export function GetCssText() {
  return (
    <style
      id="stitches"
      dangerouslySetInnerHTML={{ __html: getCssText() }}
    ></style>
  );
}
