'use client'
import React, { useEffect, useState } from 'react'
import type { Active, Over } from '@dnd-kit/core';

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
import Loading from '../components/Loading/Loading';



type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
};
interface MyDragEvent {
  active: Active;
  over: Over | null;
}
type UploadObject = {
  objectName: string;
  uploadUrl: string;
}




const Page = () => {


interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
  photoUrls: string[];

}

interface FragRackItem extends BasketItem {
  colour: string;
  magnetNum: number;
  size: string;
  stockQuantity: number;

}

  const sensors = useSensors(useSensor(MouseSensor));
  const image_url = `${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;


  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [items, setItems] = useState<FragRackItem[]>([]); 
  const [currentPage, setCurrentPage] = useState(0);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [colour, setColour] = useState(""); 
  const [files, setFiles] = useState<File[] | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [removeClicked, setRemoveClicked] = useState(false)
  // const [signedIn, setSignedIn] = useState(false);
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
    getItems()


    //NEED TO REVISIT THIS IF PAGINATION IS ENABLED

    setCurrentPage(0)
    return () => {
      // Optional cleanup on component unmount
      images.forEach(img => {
        if (img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, []);


  useEffect(() => {
  }, [removeClicked])


  const getUpdatedListOfItemsAfterRemoval = (itemId:number) => {

    setItems(  items.filter(eachitem => eachitem.id != itemId))
  }



  const removeItem = async(itemId:number) => {
    const res = await fetch(`/api/deleteItemById?itemId=${itemId}`,{
      method: "DELETE"
    })

    const data = await res.json();
    console.log(data)
    getUpdatedListOfItemsAfterRemoval(itemId)
    setRemoveClicked(!removeClicked)
  }


  const postItem = async (photoUrls:string[]) => {
    const res = await fetch('/api/postItem', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          title: title,
          photoUrls: photoUrls,
          description: description,
          price: price,
          stockQuantity:stockQuantity,
          colour: colour
        })
    })

    console.log(res)

  }



    const jsxreturnedAllItems = items.map(eachItem => {
        // console.log(eachItem.photoUrls[0])

    return (
      <div key={eachItem.id} className=' flex  w-full rounded-md bg-slate-500  md:p-2   mt-8  '>
        <Link href={`/shopFragRacks/${eachItem.id}`}>
                <div className='flex w-full justify-center'>
                  
          <div className='bg-gradient-to-r from-blue-400/20 via-pink-500/50 to-red-500/50 rounded-md w-20 h-20   flex'>
            <img src={`${image_url}/${eachItem.photoUrls[0]}`} className=' opacity-100 w-full h-full object-cover cursor-pointer' ></img>

          </div>
                  </div>


        </Link>
                <div className='flex w-full items-center mt-2 h-8 '>
                          <a className='p-2' href={`/shopFragRacks/${eachItem.id}`}>{eachItem.title}</a>

                  </div>


        <h3 className='pl-2'>£{eachItem.price}</h3>
        <h3 className=''>{eachItem.stockQuantity}</h3>

        <div className='flex flex-col  bg-orange-300'>
          <button onClick={()=>removeItem(eachItem.id)} className='flex w-8 cursor-pointer ml-4 md:ml-8 hover:w-9'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#2e2d2d" d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg> 
          </button>
          <button className='btn bg-orange-300'>
            edit
          </button>

      </div>


        {/* Page content */}
        <div className='flex w-full justify-center mt-2'>

        </div>
      </div>





    )
  })



   function getItems() {
    setLoading(true)

    fetch(`/api/getAllFragRacks?pageNumber=${currentPage}&pageSize=5`)
      .then(res => res.json())
      .then(data => {
        setItems(data.data.content)
        setLoading(false)

      }
      )
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


  const handleDragEnd = (event:MyDragEvent) => {
    const { active, over } = event;
    if(over?.id != undefined){
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(i => i.id === active.id);
      const newIndex = images.findIndex(i => i.id === over.id);
      setImages(arrayMove(images, oldIndex, newIndex));
    }
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

    <div className='flex flex-col'>
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

    <div>
      {loading?<Loading/>:jsxreturnedAllItems}


    </div>

    
    
    </div>


  )
}

export default Page
