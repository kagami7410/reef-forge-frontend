'use client';

import { useState } from 'react';

export default function ImagePreview({ src, alt }: { src: string; alt?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer max-w-full max-h-60 object-cover rounded"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}