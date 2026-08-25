"use client";

import Form from "next/form";
import CustomButton from "../components/CustomButton";
import { Upload } from "iconoir-react/regular";
import { useEffect } from "react";

export default function FindMyVibe() {
  useEffect(() => {
    const upload_box_1 = document.getElementById("upload-1");
    const file_input_1 = document.getElementById("input-1");

    if (upload_box_1 != null && file_input_1 != null) {
      upload_box_1.addEventListener("click", () => {
        file_input_1.click();
      });
    }
  });

  return (
    <div className="flex w-screen h-screen">
      <main
        className="w-full h-full flex justify-center items-center"
        id="upload-file"
      >
        <Form>
          <div className="flex w-full max-w-screen justify-center gap-4 flex-wrap">
            <div
              className="border rounded-xl w-40 h-40 flex justify-center items-center hover:bg-motif-ivory hover:text-motif-charcoal cursor-pointer flex-row gap-2 hover:animate-[gap-pulse_1s_ease-in-out_infinite]"
              id="upload-1"
            >
              <Upload />
              <span>Click to upload</span>
              <input
                type="file"
                name="file1"
                id="input-1"
                hidden
                className="border p-4 bg-zinc-800 flex w-fill h-auto aspect-square"
              ></input>
            </div>
          </div>
          {/*<CustomButton label="hi" theme="cream">
                      Find my vibe
                    </CustomButton>*/}
        </Form>
      </main>
    </div>
  );
}
