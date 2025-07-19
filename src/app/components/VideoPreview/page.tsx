'use client';

import { useState } from 'react';

export default function VideoPreview({ src, alt }: { src: string; alt?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <video
       style={{ object: 'cover' }}
        src={src}
        muted autoPlay loop
                onClick={() => setIsOpen(true)}
        className="cursor-pointer object-cover max-w-full  h-96 w-96 object-cover rounded"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <video
            src={src}
            muted autoPlay loop
            className="md:max-w-6xl w-6xl object-contain"
          />
        </div>
      )}
    </>
  );
}