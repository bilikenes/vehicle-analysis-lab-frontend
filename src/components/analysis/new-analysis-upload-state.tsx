"use client";

import { FileImage, Upload, X } from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { isSupportedVehicleImage } from "@/features/upload/vehicle-image";

type NewAnalysisUploadStateProps = {
  onAccept: (file: File) => Promise<void>;
  onCancel: () => void;
};

export function NewAnalysisUploadState({
  onAccept,
  onCancel,
}: NewAnalysisUploadStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const acceptFile = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!isSupportedVehicleImage(file)) {
      setError("Choose a JPG, PNG, or WEBP image.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onAccept(file);
    } catch {
      setError("The image could not be prepared. Try another file.");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void acceptFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-background/88 p-5 backdrop-blur-md">
      <section
        aria-labelledby="new-analysis-title"
        className={`relative w-full max-w-2xl border bg-surface p-7 transition-colors sm:p-10 ${isDragging ? "border-accent" : "border-border"}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <button
          aria-label="Cancel new analysis"
          className="absolute right-4 top-4 grid size-10 place-items-center text-secondary-text outline-none transition-colors hover:text-primary-text focus-visible:ring-2 focus-visible:ring-primary-text"
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
        <FileImage aria-hidden="true" className="mb-7 text-accent" size={30} strokeWidth={1.4} />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          New analysis
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-5xl" id="new-analysis-title">
          Drop another vehicle image here.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-secondary-text">
          The current result stays available until a new image is accepted. This prototype uses fixture extraction data while the backend is pending.
        </p>
        <button
          className="mt-8 inline-flex min-h-12 items-center gap-3 bg-accent px-5 text-sm font-semibold text-background outline-none transition-colors hover:bg-primary-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface disabled:cursor-wait disabled:opacity-60"
          disabled={isSubmitting}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Upload aria-hidden="true" size={16} />
          {isSubmitting ? "Preparing image..." : "Choose Image"}
        </button>
        <input
          ref={inputRef}
          accept="image/jpeg,image/png,image/webp"
          aria-label="Choose another vehicle image"
          className="sr-only"
          onChange={handleInputChange}
          type="file"
        />
        <div aria-live="polite" className="mt-4 min-h-5">
          {error ? <p className="text-sm text-accent">{error}</p> : null}
        </div>
      </section>
    </div>
  );
}

