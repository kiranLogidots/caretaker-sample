'use client';
import { viewEventDetail } from '@/service/page';
import { CreateEventResponse, EventResponseData } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function EventImageGallery({ id }: { id: number }) {
  const [data, setData] = useState<EventResponseData>();
  const [eventImageGallery, setEventImageGallery] =
    useState<{ imgUrl: string }[]>();

  useEffect(() => {
    const fetchData = async (eventId: number) => {
      try {
        const resultData = (await viewEventDetail(
          eventId
        )) as CreateEventResponse;
        console.log('Job request result data', resultData);
        const data = resultData.data;
        setData(data);
        const imageGallery = data.images;
        setEventImageGallery(imageGallery);
      } catch (err: any) {
        console.log('Error response for listing users', err.response);
      }
    };

    fetchData(id); // Call fetchData when the component mounts
  }, [id]);

  return (
    <div className="grid grid-cols-2 gap-3 @md:gap-4 @xl:gap-5 @2xl:gap-7">
      {eventImageGallery?.map((image, idx) => (
        <div
          key={`eventImageGallery-${idx}`}
          className="relative mx-auto aspect-[4/4.65] w-full overflow-hidden rounded bg-gray-100 @xl:rounded-md"
        >
          <Image
            fill
            priority
            src={image.imgUrl}
            placeholder="blur"
            blurDataURL={image.imgUrl}
            alt={'Event Image Gallery'}
            sizes="(max-width: 768px) 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
