'use client'
import type { Active, Over } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

const page = ({ params }: { params: Promise<{ itemId: string }>}) => {
  const sensors = useSensors(useSensor(MouseSensor));
  const [title, setTitle] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [colour, setColour] = useState(""); 
  
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [item, setItem] = useState<FragRackItem>();
  const [loading, setLoading] = useState(true);
  const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;
  const [images, setImages] = useState<ImageItem[]>([]); // imageItem: { id, file, previewUrl }
  const [files, setFiles] = useState<File[] | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [removeClicked, setRemoveClicked] = useState(false)
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
  interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
  photoUrls: string[];
  stockQuantity: number;

}

interface FragRackItem extends BasketItem {
  colour: string;
  magnetNum: number;
  size: string;
  stockQuantity: number;
  description: string;
}


  useEffect(() => {

    fetchItem()
    setLoading(false)
    // setFileNames(item?.photoUrls)

  }, [])




  const updateItem = async () => {
    const res = await fetch('/api/updateItem', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          title: title,
          // photoUrls: photoUrls,
          description: description,
          price: price,
          stockQuantity:stockQuantity,
          colour: colour
        })
    })

    console.log(res)

  }






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

  const fetchItem = async () => {
    const res = await fetch(`/api/getFragRackById?itemId=${(await params).itemId}`)
    const data = await res.json()
    setItem(data)
    console.log(data)

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
  

  return (
    <div className='flex flex-col mt-14 w-96 bg-amber-100 align-middle justify-center items-center'>
        <h1>Edit Item</h1>
        <div className='flex flex-col'>
            <div className='flex flex-col w-96  p-2 md:p-6 md:pl-8 md:w-1/2 md:mt-2 rounded-xl shadow-2xl'>
                          <h1 className='flex pl-2 text-sm'>Reef Forge</h1>
          <Link href={`/shopFragRacks/${item?.id}`}>
            <img src={`${image_url}/All/${item?.photoUrls[0]}`} className='border rounded-md cursor-pointer' ></img>

          </Link>
      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Price</h1>

      <input type="text" placeholder={item?.price.toString()}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required className="input m-2" />

      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Description</h1>

      <input type="text" placeholder={item?.description.toString()}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required className="input m-2 w-full" />


      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Stock Quantity</h1>

      <input type="text" placeholder={item?.stockQuantity.toString()}
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
        required className="input m-2 w-full" />

      <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Colour</h1>

      <input type="text" placeholder={item?.colour.toString()}
        value={colour}
        onChange={(e) => setColour(e.target.value)}
        required className="input m-2 w-full" />



          


            </div> 


                    <div className='flex'>
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
                          <button onClick={updateItem} className='btn text-gray-50 hover:text-slate-50 hover:bg-blue-800 w-48 mt-4 bg-blue-600'>Get Access Url</button>



        </div>
      
    </div>
  )
}

export default page
