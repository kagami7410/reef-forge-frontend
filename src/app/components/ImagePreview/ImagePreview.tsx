'use client';

import { useState } from 'react';


import React from 'react'

const Page = ( { src }: { src: string}) => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
       <img
        src={src}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer max-w-full max-h-96 object-cover rounded"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
export default Page