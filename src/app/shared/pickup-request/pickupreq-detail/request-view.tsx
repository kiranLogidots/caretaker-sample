'use client';

import Image from 'next/image';
import { useAtomValue } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import { PiCheckBold } from 'react-icons/pi';
import {
  billingAddressAtom,
  orderNoteAtom,
  shippingAddressAtom,
} from '@/store/checkout';
// import { useCart } from '@/store/quick-cart/cart.context';
import { Title, Text } from '@/components/ui/text';
import { toCurrency } from '@/utils/to-currency';
import { formatDate } from '@/utils/format-date';
import usePrice from '@/hooks/use-price';
import cn from '@/utils/class-names';
import OrderViewProducts from '../../ecommerce/order/order-products/order-view-products';
import { jobTrackings, viewJobRequest } from '@/service/page';
import { useEffect, useState } from 'react';
import {
  CollectionPointData,
  DriverData,
  JobRequestResponse,
  JobRequestResponseData,
  JobTrackingResponse,
  JobTrackingResponseData,
  TrackingImages,
  TrackingStatus,
} from '@/types';
import DateCell from '@/components/ui/date-cell';

const orderStatus = [
  { id: 1, label: 'Job Request Initiated' },
  { id: 2, label: 'In progress' },
  // { id: 3, label: 'Order At Local Facility' },
  // { id: 4, label: 'Order Out For Delivery' },
  { id: 5, label: 'Completed' },
];

const transitions = [
  {
    id: 1,
    paymentMethod: {
      name: 'MasterCard',
      image:
        'https://isomorphic-furyroad.s3.amazonaws.com/public/payment/master.png',
    },
    price: '$1575.00',
  },
  {
    id: 2,
    paymentMethod: {
      name: 'PayPal',
      image:
        'https://isomorphic-furyroad.s3.amazonaws.com/public/payment/paypal.png',
    },
    price: '$75.00',
  },
  {
    id: 2,
    paymentMethod: {
      name: 'Stripe',
      image:
        'https://isomorphic-furyroad.s3.amazonaws.com/public/payment/stripe.png',
    },
    price: '$375.00',
  },
];

const currentOrderStatus = 3;

function WidgetCard({
  title,
  className,
  children,
  childrenWrapperClass,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
  childrenWrapperClass?: string;
}) {
  return (
    <div className={className}>
      <Title
        as="h3"
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
      >
        {title}
      </Title>
      <div
        className={cn(
          'rounded-lg border border-muted px-5 @sm:px-7 @5xl:rounded-xl',
          childrenWrapperClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function JobRequestView({ id }: { id: number }) {
  const [driverData, setDriverData] = useState<DriverData | undefined>();
  const [pickupPoint, setPickUpPoint] = useState<CollectionPointData>();
  const [data, setData] = useState<JobRequestResponseData>();
  const [trackingData, setTrackingData] = useState<JobTrackingResponseData[]>(
    []
  );
  const [statusTrackingData, setStatusTrackingData] =
    useState<TrackingStatus>();
  const [imageTrackingData, setImageTrackingData] = useState<TrackingImages[]>(
    []
  );

  useEffect(() => {
    const fetchData = async (jobId: number) => {
      try {
        const resultData = (await viewJobRequest(jobId)) as JobRequestResponse;
        console.log('Job request result data', resultData);
        const data = resultData.data;
        setData(data);
        const driverData = data.driver_data;
        setDriverData(driverData);
        const pickupAddress = data.collection_point_data;
        setPickUpPoint(pickupAddress);
      } catch (err: any) {
        console.log('Error response for listing users', err.response);
      }
    };

    fetchData(id); // Call fetchData when the component mounts
  }, [id]);

  useEffect(() => {
    const fetchData = async (jobId: number) => {
      try {
        const resultData = (await jobTrackings(jobId)) as JobTrackingResponse;
        const data = resultData.data;
        console.log('Job tracking data', data);

        setTrackingData(data);
      } catch (err: any) {
        console.log('Error response for listing users', err.response);
      }
    };

    fetchData(id); // Call fetchData when the component mounts
  }, [id]);
  // const { items, total, totalItems } = useCart();
  // const { price: subtotal } = usePrice(
  //   items && {
  //     amount: total,
  //   }
  // );
  // const { price: totalPrice } = usePrice({
  //   amount: total,
  // });
  const orderNote = useAtomValue(orderNoteAtom);
  const billingAddress = useAtomValue(billingAddressAtom);
  const shippingAddress = useAtomValue(shippingAddressAtom);
  return (
    <div className="@container">
      <div className="flex flex-wrap justify-center border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-start">
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {/* October 22, 2022 at 10:30 pm */}
          {/* {formatDate(new Date(), 'MMMM D, YYYY')} at{' '} */}
          {/* {formatDate(new Date(), 'h:mm A')} */}
          Pickup Point - {pickupPoint?.name}
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {/* {totalItems} */}
          {data?.date}
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          Weight- {data?.weight}
          {/* {totalPrice} */}
        </span>
        <span className="my-2 ms-5 rounded-3xl border-r border-muted bg-green-lighter px-2.5 py-1 text-xs text-green-dark first:ps-0 last:border-r-0">
          {data?.status?.name}
        </span>
      </div>
      <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          {orderNote && (
            <div className="">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Notes About Order
              </span>
              <div className="rounded-xl border border-muted px-5 py-3 text-sm leading-[1.85]">
                {orderNote}
              </div>
            </div>
          )}

          {/* <OrderViewProducts /> */}
          {/* <div className="border-t border-muted pt-7 @5xl:mt-3">
              <div className="ms-auto max-w-lg space-y-6">
                <div className="flex justify-between font-medium">
                Subtotal 
                </div>
                <div className="flex justify-between font-medium">
                  Store Credit <span>{toCurrency(0)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  Subtotal <span>{toCurrency(0)}</span>
                </div>
                <div className="flex justify-between border-t border-muted pt-5 text-base font-semibold">
                Total 
                </div>
              </div>
            </div> */}

          <div className="">
            <Title
              as="h3"
              className="mb-3.5  text-base font-semibold @5xl:mb-5 @7xl:text-lg"
            >
              Stages
            </Title>

            <div className="space-y-4">
              {trackingData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center rounded-lg border border-gray-100 px-5 py-5 font-medium shadow-sm transition-shadow @5xl:px-7"
                >
                  <div className="flex flex-col items-start gap-3">
                    <Text
                      as="span"
                      className="font-lexend text-lg font-semibold text-gray-900"
                    >
                      Stage {item.status?.order}
                    </Text>
                    {/* <Text as="span" className="font-lexend text-gray-700"> */}
                      {/* {item.time} */}
                       <DateCell date={item.time} />
                    {/* </Text> */}
                    <Text as="span" className="font-lexend text-gray-700">
                      {item.weight ? `Weight - ${item.weight}` : null}
                    </Text>
                    {item.images.map((image) => (
                      <Image
                        key={image.id}
                        src={image.imgUrl}
                        alt={String(image.id)}
                        height={80}
                        width={360}
                        className="object-contain"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="">
            <Title
              as="h3"
              className="mb-3.5  text-base font-semibold @5xl:mb-5 @7xl:text-lg"
            >
              Transactions
            </Title>

            <div className="space-y-4">
              {transitions.map((item) => (
                <div
                  key={item.paymentMethod.name}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-5 py-5 font-medium shadow-sm transition-shadow @5xl:px-7"
                >
                  <div className="flex w-1/3 items-center">
                    <div className="shrink-0">
                      <Image
                        src={item.paymentMethod.image}
                        alt={item.paymentMethod.name}
                        height={60}
                        width={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col ps-4">
                      <Text as="span" className="font-lexend text-gray-700">
                        Payment
                      </Text>
                      <span className="pt-1 text-[13px] font-normal text-gray-500">
                        Via {item.paymentMethod.name}
                      </span>
                    </div>
                  </div>

                  <div className="w-1/3 text-end">{item.price}</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
        <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <WidgetCard
            title="Order Status"
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100">
              {orderStatus.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5  after:h-10 after:w-0.5  after:content-[''] last:after:hidden",
                    currentOrderStatus > item.id
                      ? 'before:bg-primary after:bg-primary'
                      : 'after:hidden',
                    currentOrderStatus === item.id && 'before:bg-primary'
                  )}
                >
                  {currentOrderStatus >= item.id ? (
                    <span className="absolute -start-1.5 top-1 text-white">
                      <PiCheckBold className="h-auto w-3" />
                    </span>
                  ) : null}

                  {item.label}
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard
            title="Driver Details"
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="relative aspect-square h-16 w-16 shrink-0 @5xl:h-20 @5xl:w-20">
              <Image
                fill
                alt="avatar"
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/profile-image.webp"
              />
            </div>
            <div className="ps-4 @5xl:ps-6">
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                {driverData?.name}
              </Title>
              <Text as="p" className="mb-2 break-all last:mb-0">
                {driverData?.email}
              </Text>
              <Text as="p" className="mb-2 last:mb-0">
                {driverData?.phone}
              </Text>
            </div>
          </WidgetCard>

          {/* <WidgetCard
            title="Shipping Address"
            childrenWrapperClass="@5xl:py-6 py-5"
          >
            <Title
              as="h3"
              className="mb-2.5 text-base font-semibold @7xl:text-lg"
            >
              {billingAddress?.customerName}
            </Title>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              {billingAddress?.street}, {billingAddress?.city},{' '}
              {billingAddress?.state}, {billingAddress?.zip},{' '}
              {billingAddress?.country}
            </Text>
          </WidgetCard> */}
          {/* {!isEmpty(shippingAddress) && (
            <WidgetCard
              title="Billing Address"
              childrenWrapperClass="@5xl:py-6 py-5"
            >
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                {shippingAddress?.customerName}
              </Title>
              <Text as="p" className="mb-2 leading-loose last:mb-0">
                {shippingAddress?.street}, {shippingAddress?.city},{' '}
                {shippingAddress?.state}, {shippingAddress?.zip},{' '}
                {shippingAddress?.country}
              </Text>
            </WidgetCard>
          )} */}
        </div>
      </div>
    </div>
  );
}
