"use client";

import { useEffect, useState } from "react";
import { Upload } from "iconoir-react/regular";
import { analyzeImages } from "../find-my-vibe/actions";

const uploadSlots = Array.from({ length: 5 });

export default function UploadForm() {
  const [files, setFiles] = useState<(File | null)[]>(
    Array(5).fill(null)
  );

  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(5).fill(null)
  );

  useEffect(() => {
    const urls = files.map((file) =>
      file ? URL.createObjectURL(file) : null
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  function handleFileChange(index: number, file: File | null) {
    setFiles((currentFiles) => {
      const updatedFiles = [...currentFiles];
      updatedFiles[index] = file;
      return updatedFiles;
    });
  }

  return (
    <form
      action={analyzeImages}
      className="flex flex-wrap justify-center gap-4"
    >
      {uploadSlots.map((_, index) => {
        const inputId = `input-${index + 1}`;
        const preview = previews[index];

        return (
          <label
            key={inputId}
            htmlFor={inputId}
            className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border transition-colors hover:bg-motif-ivory hover:text-motif-charcoal"
          >
            {preview ? (
              <img
                src={preview}
                alt={`Uploaded image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <Upload aria-hidden="true" />
                <span>Upload image {index + 1}</span>
              </>
            )}

            <input
              id={inputId}
              name={`file${index + 1}`}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="sr-only"
              onChange={(event) =>
                handleFileChange(
                  index,
                  event.currentTarget.files?.[0] ?? null
                )
              }
            />
          </label>
        );
      })}

      <button type="submit" className="w-full rounded-lg border px-4 py-2">
        Find my vibe
      </button>
    </form>
  );
}
