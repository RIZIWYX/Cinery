"use client";

import { useState, useEffect } from "react";

type TrailerModalProps = {
  videoKey: string;
  videoName: string;
};

export default function TrailerModal({ videoKey, videoName }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-neutral-200 transition-colors"
      >
        <span className="text-lg">&#9654;</span>
        <span>Bande-annonce</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={videoName}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-black/60 text-white w-10 h-10 flex items-center justify-center text-xl hover:bg-black/80 transition-colors"
            aria-label="Fermer"
          >
            &times;
          </button>

          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={videoName}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
