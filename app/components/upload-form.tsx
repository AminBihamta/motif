"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { ArrowRight, Check, Upload } from "iconoir-react";
import { analyzeImages } from "../find-my-vibe/actions";
import type { AnalyzeImagesState } from "../lib/vibe-analysis";
import { REQUIRED_IMAGE_COUNT } from "../lib/upload-constraints";

const uploadSlots = Array.from({ length: REQUIRED_IMAGE_COUNT });
const initialState: AnalyzeImagesState = { status: "idle" };
const acceptedTypes = new Set(["image/jpeg", "image/png"]);
const maxFileSize = 5 * 1024 * 1024;

export default function UploadForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const hasNavigated = useRef(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [state, formAction, pending] = useActionState(analyzeImages, initialState);
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(REQUIRED_IMAGE_COUNT).fill(null),
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);
  const uploadedCount = previews.filter(Boolean).length;

  useEffect(() => {
    if (state.status !== "success" || hasNavigated.current) return;
    hasNavigated.current = true;
    router.push("/my-vibe");
  }, [router, state]);

  function handleFileChange(index: number, file: File | null) {
    if (!file) {
      setPreviews((current) => current.map((preview, i) => i === index ? null : preview));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviews((current) => current.map((preview, i) =>
        i === index && typeof reader.result === "string" ? reader.result : preview
      ));
    };
    reader.readAsDataURL(file);
  }

  function getFileError(file: File) {
    if (!acceptedTypes.has(file.type)) {
      return `${file.name}: only JPG and PNG files are allowed.`;
    }

    if (file.size > maxFileSize) {
      return `${file.name}: images must be smaller than 5 MB.`;
    }

    return null;
  }

  function assignFileToSlot(index: number, file: File) {
    const input = inputRefs.current[index];

    if (!input) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    handleFileChange(index, file);
  }

  function handleBulkFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const emptySlots = previews
      .map((preview, index) => (preview ? null : index))
      .filter((index): index is number => index !== null);
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const error = getFileError(file);

      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    const filesToAssign = validFiles.slice(0, emptySlots.length);

    filesToAssign.forEach((file, index) => {
      assignFileToSlot(emptySlots[index], file);
    });

    if (validFiles.length > emptySlots.length) {
      errors.push(
        `${validFiles.length - emptySlots.length} extra image${validFiles.length - emptySlots.length === 1 ? " was" : "s were"} ignored because all six slots are full.`,
      );
    }

    setDropError(errors[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>, index: number) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setDraggingIndex(index);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setDraggingIndex(null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>, index: number) {
    event.preventDefault();
    setDraggingIndex(null);

    const droppedFiles = event.dataTransfer.files;
    const file = droppedFiles[0];

    if (!file) return;

    if (droppedFiles.length > 1) {
      handleBulkFiles(droppedFiles);
      return;
    }

    const error = getFileError(file);

    if (error) {
      setDropError(error);
      return;
    }

    setDropError(null);
    assignFileToSlot(index, file);
  }

  return (
    <form action={formAction}>
      <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-motif-ivory pb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-motif-taupe">Evidence collected</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em]">
            {uploadedCount === REQUIRED_IMAGE_COUNT
              ? "Ready to decode"
              : `${REQUIRED_IMAGE_COUNT - uploadedCount} remaining`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="group flex cursor-pointer items-center gap-2 border-2 border-motif-ivory bg-motif-black px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] transition-colors hover:bg-motif-ivory hover:text-motif-black focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-motif-red sm:px-4 sm:text-[10px]">
            <Upload aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Select multiple</span>
            <span className="sm:hidden">Bulk</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              className="sr-only"
              disabled={pending || uploadedCount === REQUIRED_IMAGE_COUNT}
              onChange={(event) => {
                if (event.currentTarget.files) {
                  handleBulkFiles(event.currentTarget.files);
                }
                event.currentTarget.value = "";
              }}
            />
          </label>
          <span className="bodoniModa text-5xl leading-none">
            {uploadedCount}<span className="text-motif-taupe">/{REQUIRED_IMAGE_COUNT}</span>
          </span>
        </div>
      </div>

      <div className="mb-5 h-2 border border-motif-ivory bg-motif-black" role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={REQUIRED_IMAGE_COUNT} aria-valuenow={uploadedCount}>
        <motion.div className="h-full bg-motif-red" animate={{ width: `${(uploadedCount / REQUIRED_IMAGE_COUNT) * 100}%` }} transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        {uploadSlots.map((_, index) => {
          const inputId = `input-${index + 1}`;
          const preview = previews[index];

          return (
            <motion.label
              key={inputId}
              htmlFor={inputId}
              onDragEnter={(event) => handleDragOver(event, index)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDragLeave={handleDragLeave}
              onDrop={(event) => handleDrop(event, index)}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              className={`group relative col-span-1 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden border-2 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-motif-red sm:col-span-2 ${draggingIndex === index ? "border-motif-ivory bg-motif-blue text-motif-ivory shadow-[inset_0_0_0_4px_var(--color-motif-black)]" : preview ? "border-motif-red bg-motif-black" : "border-motif-ivory bg-motif-black hover:bg-motif-ivory hover:text-motif-black"}`}
            >
              {draggingIndex === index && (
                <span className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-motif-blue/95 px-4 text-center text-xs font-black uppercase tracking-[0.16em] text-motif-ivory">
                  Drop frame {String(index + 1).padStart(2, "0")}
                </span>
              )}
              {preview ? (
                <>
                  <Image src={preview} alt={`Uploaded image ${index + 1}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                  <span className="absolute inset-0 bg-motif-black/0 transition-colors group-hover:bg-motif-black/35" />
                  <span className="absolute left-2 top-2 flex size-7 items-center justify-center bg-motif-red text-motif-ivory"><Check aria-hidden="true" className="size-4" /></span>
                  <span className="absolute bottom-0 left-0 right-0 translate-y-full bg-motif-black px-3 py-2 text-center text-[9px] font-black uppercase tracking-[0.16em] text-motif-ivory transition-transform group-hover:translate-y-0 motion-reduce:transition-none">Replace frame {String(index + 1).padStart(2, "0")}</span>
                </>
              ) : (
                <>
                  <span className="absolute left-2 top-2 text-[9px] font-black tracking-[0.18em] text-motif-taupe group-hover:text-motif-red">{String(index + 1).padStart(2, "0")}</span>
                  <Upload aria-hidden="true" className="mb-3 size-7" />
                  <span className="text-center text-[10px] font-black uppercase tracking-[0.14em]">Choose or drop</span>
                </>
              )}
              <input ref={(node) => { inputRefs.current[index] = node; }} id={inputId} name={`file${index + 1}`} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="sr-only" required disabled={pending} onChange={(event) => { setDropError(null); handleFileChange(index, event.currentTarget.files?.[0] ?? null); }} />
            </motion.label>
          );
        })}
      </div>

      <button type="submit" disabled={pending || uploadedCount !== REQUIRED_IMAGE_COUNT} className="group mt-5 flex w-full items-center justify-between border-2 border-motif-ivory bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_var(--color-motif-blue)] transition-all hover:bg-motif-ivory hover:text-motif-red disabled:cursor-not-allowed disabled:bg-motif-black disabled:text-motif-taupe disabled:opacity-60 disabled:shadow-none">
        <span>{pending ? "Reading the room..." : "Decode my taste"}</span>
        <ArrowRight aria-hidden="true" className="size-6 transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 motion-reduce:transition-none" />
      </button>

      <div aria-live="polite">
        {dropError && (
          <p className="mt-4 border-2 border-motif-red bg-motif-black px-4 py-3 text-sm font-bold text-motif-ivory"><span className="mr-2 text-motif-red">Drop error /</span>{dropError}</p>
        )}
        {state.status === "error" && (
          <p className="mt-4 border-2 border-motif-red bg-motif-black px-4 py-3 text-sm font-bold text-motif-ivory"><span className="mr-2 text-motif-red">Error /</span>{state.message}</p>
        )}
      </div>
    </form>
  );
}
