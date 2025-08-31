// app/shopFragRacks/[itemId]/page.tsx  (Server Component by default)
import { Metadata } from "next";
import ItemPage from "./ItemPage";



async function getItemByItem(productId: number) {
  const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
  const res = await fetch(`${backendHostName}/backend/fragRacks/getById?itemId=${productId}`, {
    cache: "no-store",
  });

  const data = await res.json()

  if (!res.ok) throw new Error("Failed to fetch product");
  if(res){
    // console.log("printing item: "+ data.id)
  return data;

  }

}
export async function generateMetadata({ params }: { params: Promise<{ itemId: string }> }): Promise<Metadata> {
  const item = await getItemByItem(Number((await params).itemId));
  const title = item?.title ?? "Reef Forge Magnetic Frag Rack";
  const description = item?.description ?? "Reef Forge Magnetic Racks";
  const image = item?.photoUrls?.[0] ?? "/default-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      url: `https://reef-forge.uk/shopFragRacks/${(await params).itemId}`,
    },
    twitter:{
      title: title,
      description,
      images: [image],
      card: "summary_large_image"
    },
  };
}

export default async function Page({ params }: { params: Promise<{ itemId: string }> }) {
  const item = await getItemByItem(Number((await params).itemId));
  console.log("item_id: : " + item.id)

  return <ItemPage singleItem={item} />;
}