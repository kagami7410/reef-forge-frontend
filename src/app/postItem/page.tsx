'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { CSS } from '@dnd-kit/utilities';



type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
};


type UploadObject = {
  objectName: string;
  uploadUrl: string;
}

type ImageRequest = {
  fileName: string;
  fileType: string;
}



const Page = () => {

  interface AuthenticateRequest {
    userEmail: string;
    password: string;
  }

  const sensors = useSensors(useSensor(MouseSensor));



  const [title, setTitle] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [colour, setColour] = useState(""); 
  const [files, setFiles] = useState<File[] | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const [images, setImages] = useState<ImageItem[]>([]); // imageItem: { id, file, previewUrl }

  // const handleAddFiles = (files: FileList) => {
  //   const newImages = Array.from(files).map(file => ({
  //     id: crypto.randomUUID(), // ✅ stable ID
  //     file,
  //     previewUrl: URL.createObjectURL(file),
  //   }));

  //   setImages(prev => [...prev, ...newImages]);
  // };
  // ✅ Better approach: Revoke only newly removed URLs
  // Replace with this cleanup method:

  // That means:
  // Only revoke on unmount
  // Don't revoke during drag-and-drop reorder

  useEffect(() => {
    return () => {
      // Optional cleanup on component unmount
      images.forEach(img => {
        if (img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, []);


  const postItem = async (photoUrls:string[]) => {
    const res = await fetch('/api/postItem', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          title: title,
          size: null,
          photoUrls: photoUrls,
          description: description,
          price: price,
          stockQuantity:stockQuantity,
          colour: colour
        })
    })

    console.log(res)

  }



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected) return;

    const newImages: ImageItem[] = Array.from(selected).map((file, idx) => ({
      id: `${Date.now()}-${idx}`, // unique key
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages(prev => [...prev, ...newImages]);
    setFiles(selected)



  };

  console.log(fileNames)


  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(i => i.id === active.id);
      const newIndex = images.findIndex(i => i.id === over.id);
      setImages(arrayMove(images, oldIndex, newIndex));
    }
  };

  const removeImage = (idToRemove: string) => {
    // setImages(prev => {
    //   const removed = prev.find(img => img.id === idToRemove);
    //   if (removed?.previewUrl.startsWith('blob:')) {
    //     URL.revokeObjectURL(removed.previewUrl);
    //   }
    //   return prev.filter(img => {
    //     img.id !== idToRemove}); // ✅ returns a NEW array
    // });
    setImages(prevImages => {
      const toRemove = prevImages.find(img => img.id === idToRemove);
      if (toRemove?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(toRemove.previewUrl); // Clean up memory
      }
      // Filter out the image
      const updatedImages = prevImages.filter(img => img.id !== idToRemove);

      // Also update files array based on remaining images
      const updatedFiles = updatedImages.map(img => img.file);
      setFiles(updatedFiles);

      // Also update fileNames array based on remaining images
      const updatedFileNames = updatedImages.map(img => img.file.name);
      setFileNames(updatedFileNames);



      //filters out the image by id and return the remaining ones
      return updatedImages;
    })
  };


  useEffect(() => {
    const updatesFilesNames = images.map(eachImage => eachImage.file.name)
    setFileNames(updatesFilesNames);
    console.log(fileNames)
    console.log(images)

  }, [images])

    useEffect(() => {
    console.log(fileNames)
  }, [fileNames])



  const getAccessUrl = async () => {
    const FileNames = files?.map(file => ({ fileName: file.name, contentType: file.type }))
    const res = await fetch('/api/getGcsBucketAccessUrl', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },



      body: JSON.stringify(
        FileNames
      )
    })


    // 2. Upload the file directly to GCS
    // const uploadRes = await fetch(res?, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': file?.type,
    //   },
    //   body: file,
    // });

    const data_response_url = await res.json()

    const uploadUrlsAndObjectName: UploadObject[] = data_response_url.data
    const objectName: string[] = uploadUrlsAndObjectName.map(eachObject => eachObject.objectName)
    console.log(objectName)


    for (let i = 0; i < uploadUrlsAndObjectName.length; i++) {
      if(files != undefined){
        const file = files[i]
        const uploadUrl = uploadUrlsAndObjectName[i].uploadUrl


              // 2. Upload the file directly to GCS
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file
    });


    if(uploadRes.status ===200){
      postItem(fileNames)
      console.log("fileNames : " + JSON.stringify(fileNames))

    }
      console.log(uploadRes)
      }
    }

    console.log("res: " + JSON.stringify(data_response_url.data))
  }









  function SortableImage({
    image,
    onRemove,
  }: {
    image: ImageItem;
    onRemove: (id: string) => void;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: image.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes} // ✅ attach only attributes here
        className="flex items-center gap-4 p-2 border rounded shadow"
      >
        <div {...listeners} className="cursor-grab pr-2">☰</div> {/* ✅ drag handle */}
        <img src={image.previewUrl} alt="preview" className="w-24 h-24 object-cover rounded" />
        <div className="flex-1">
          <span>{image.file.name}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Removing image:', image.id);
            onRemove(image.id);
          }}
          className="text-red-500 hover:text-red-700 w-8 h-8 rounded-full text-xl font-bold flex items-center justify-center"
        >
          ✖
        </button>
      </div>
    );
  }


  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const selected = e.target.files?.[0] || null;
  //     setFile(selected);
  //     if (selected) {
  //         setPreview(URL.createObjectURL(selected));
  //     }
  // };


  // console.log(userEmail + password)

  return (

    <div className='relative w-full min-w-96 bg-lime-100 p-6  flex flex-col '>
      <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE </Link>

      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Title</h1>

      <input type="text" value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Title" className="input m-2" />
      <h1 className='text-lg font-bold font-sans  mt-3 w-full'>Photos & Videos</h1>
      <div className=' flex items-center  flex-col w-full   border bg-slate-50 border-slate-400 border-dashed rounded-lg border-2 min-h-96 p-20'>

        <h1 className="items-center w-full flex ">Drag and drop files</h1>
        {/* <div className='flex w-full'>
                    <fieldset className="fieldset w-full text-sm">
                        <legend className="fieldset-legend ">Pick a file</legend>
                        <input type="file" className="file-input text-sm" />
                        <label className="label">Max size 2MB</label>
                    </fieldset> </div> */}


        <div>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={images.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="mt-4 flex flex-col gap-4">
                {images.map(image => (
                  <SortableImage key={image.id} image={image} onRemove={removeImage} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

      </div>

      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Price</h1>

      <input type="text" placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required className="input m-2" />

      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Description</h1>

      <input type="text" placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required className="input m-2 w-full" />


      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Stock Quantity</h1>

      <input type="text" placeholder="Stock Quantity"
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
        required className="input m-2 w-full" />

      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Colour</h1>

      <input type="text" placeholder="Colour"
        value={colour}
        onChange={(e) => setColour(e.target.value)}
        required className="input m-2 w-full" />


      <button onClick={getAccessUrl} className='btn text-gray-50 hover:text-slate-50 hover:bg-blue-800 w-48 mt-4 bg-blue-600'>Get Access Url</button>
      {/* <button onClick={clickSignIn} className='btn text-gray-50 hover:text-slate-50 hover:bg-blue-800 w-48 mt-4 bg-blue-600'>List Item</button> */}
    </div>


  )
}

export default Page
