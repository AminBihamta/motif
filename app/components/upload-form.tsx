"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { ArrowRight, Check, Upload } from "iconoir-react";
import { analyzeImages } from "../find-my-vibe/actions";
import type { AnalyzeImagesState } from "../lib/vibe-analysis";
import { REQUIRED_IMAGE_COUNT } from "../lib/upload-constraints";
import { capturePostHogEvent } from "../lib/posthog";

const uploadSlots = Array.from({ length: REQUIRED_IMAGE_COUNT });
const initialState: AnalyzeImagesState = { status: "idle" };
const acceptedTypes = new Set(["image/jpeg", "image/png"]);
const maxFileSize = 5 * 1024 * 1024;
const loadingMessages = [
  "Reading the room...",
  "Connecting suspiciously tasteful dots...",
  "Interrogating your color choices...",
  "Consulting the imaginary mood-board council...",
  "Separating the iconic from the ironic...",
  "Measuring your tolerance for beige...",
  "Finding the plot in your Pinterest energy...",
  "Checking whether the lamp is the main character...",
  "Translating vibes into actual words...",
  "Almost done. Dramatic pause included...",
];

type UsageDisplay = {
  analysesRemaining: number;
  searchesRemaining: number;
  eligible: boolean;
  isGuest: boolean;
} | null;

export default function UploadForm({ usage }: { usage: UsageDisplay }) {
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
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const uploadedCount = previews.filter(Boolean).length;

  useEffect(() => {
    if (!pending) return;

    const interval = window.setInterval(() => {
      setLoadingMessageIndex((current) =>
        (current + 1) % loadingMessages.length,
      );
    }, reduceMotion ? 3000 : 3000);

    return () => window.clearInterval(interval);
  }, [pending, reduceMotion]);

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
    <form
      action={formAction}
      onSubmit={() =>
        capturePostHogEvent("taste_analysis_started", {
          image_count: uploadedCount,
        })
      }
    >
      {usage && (
        <div className="mb-5 border-2 border-motif-blue bg-motif-black px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-motif-ivory">
          {usage.eligible ? (
            <span>
              {usage.isGuest ? "Guest allowance" : "Member allowance"} — {usage.analysesRemaining} analysis{usage.analysesRemaining === 1 ? "" : "es"} + {usage.searchesRemaining} search{usage.searchesRemaining === 1 ? "" : "es"} left{usage.isGuest ? "" : " this week"}
            </span>
          ) : (
            <span>
              Verify your email to unlock five analyses and five searches per week. <Link href="/signin" className="text-motif-red underline underline-offset-2">Verify account</Link>
            </span>
          )}
        </div>
      )}
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

      <button type="submit" disabled={pending || uploadedCount !== REQUIRED_IMAGE_COUNT} className={`group relative mt-5 flex min-h-[3.75rem] w-full items-center justify-between overflow-hidden border-2 border-motif-ivory px-5 py-4 text-left text-sm font-black uppercase tracking-[0.14em] transition-all ${pending ? "cursor-wait bg-motif-black text-motif-ivory shadow-[6px_6px_0_var(--color-motif-red)]" : "bg-motif-red shadow-[6px_6px_0_var(--color-motif-blue)] hover:bg-motif-ivory hover:text-motif-red disabled:cursor-not-allowed disabled:bg-motif-black disabled:text-motif-taupe disabled:opacity-60 disabled:shadow-none"}`}>
        {pending && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-motif-blue/45 to-transparent"
            animate={reduceMotion ? undefined : { x: ["0%", "410%"] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
          />
        )}

        <span className="relative z-10 min-w-0 pr-4">
          {pending ? (
            <>
              <span className="sr-only" aria-live="polite">
                {loadingMessages[loadingMessageIndex]}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={loadingMessageIndex}
                  aria-hidden="true"
                  className="flex flex-wrap"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  {loadingMessages[loadingMessageIndex]
                    .split("")
                    .map((character, index) => (
                      <motion.span
                        key={`${loadingMessageIndex}-${index}`}
                        className={character === " " ? "w-[0.42em]" : undefined}
                        animate={
                          reduceMotion
                            ? undefined
                            : { y: [0, -4, 0], color: ["#e8ddc8", "#1f5889", "#e8ddc8"] }
                        }
                        transition={{
                          duration: 0.72,
                          delay: index * 0.025,
                          repeat: Infinity,
                          repeatDelay: Math.max(
                            0.15,
                            0.65 - loadingMessages[loadingMessageIndex].length * 0.025,
                          ),
                          ease: "easeInOut",
                        }}
                      >
                        {character === " " ? "\u00a0" : character}
                      </motion.span>
                    ))}
                </motion.span>
              </AnimatePresence>
            </>
          ) : (
            "Decode my taste"
          )}
        </span>
        <motion.span
          aria-hidden="true"
          className="relative z-10 shrink-0"
          animate={
            pending && !reduceMotion
              ? { x: [0, 5, 0], opacity: [0.45, 1, 0.45] }
              : undefined
          }
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="size-6 transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 motion-reduce:transition-none" />
        </motion.span>
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
