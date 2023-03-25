import React from "react";
import { useTranslation } from "react-i18next";
import { useRive } from "rive-react";
function RiveResult({ id = "noresult", text = "" }) {
  const { t: tl } = useTranslation();
  const src = {
    noproductsfound: "/rive/noproductsfound.riv",
    noresult: "/rive/noresult.riv",
    nosell: "/rive/nosell.riv",
  };
  const riveParams = {
    src: src[id],
    artboard: "New Artboard",
    autoplay: true,
  };
  const { RiveComponent } = useRive(riveParams);
  return (
    <div className="animation-canvas">
      <div style={{ width: "100%", height: 150 }}>
        <RiveComponent />
      </div>
      <div className="text">{tl(text)}</div>
    </div>
  );
}

export default RiveResult;
