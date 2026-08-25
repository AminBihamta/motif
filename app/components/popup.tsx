"use client";

import CustomButton from "./CustomButton";
import { Play, Xmark } from "iconoir-react";

function togglePopup() {
  const popup = document.getElementById("popup");
  if (popup != null) {
    if (popup?.classList.contains("popup-enabled")) {
      popup.classList.remove("popup-enabled");
      popup.classList.add("popup-disabled");
    } else {
      popup.classList.remove("popup-disabled");
      popup.classList.add("popup-enabled");
    }
  }
}

export default function Popup() {
  return (
    <>
      <CustomButton
        theme="cream"
        label="Watch a demo"
        onClick={togglePopup}
        icon={Play}
      />
      <div
        className="fixed w-dvw h-dvh top-0 left-0 z-100 popup-disabled"
        id="popup"
      >
        <div className="fixed w-dvw h-dvh top-0 left-0 bg-black opacity-50"></div>
        <div className="fixed w-320 h-180 top-1/2 left-1/2 bg-motif-olive -translate-1/2 rounded-2xl flex justify-center items-center p-2">
          <button onClick={togglePopup} className="flex w-fit h-fit bg-motif-olive -top-12 p-2 rounded-xl absolute left-0 border border-motif-olive cursor-pointer hover:border-motif-ivory">
            <Xmark />
          </button>
          <iframe
            className="w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/NpEaa2P7qZI"
            title="video placeholder"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </>
  );
}
