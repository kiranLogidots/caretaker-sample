// 'use client';
// import { Badge } from '@/components/ui/badge';
// import { viewEventDetail } from '@/service/page';
// import { CreateEventResponse, EventResponseData } from '@/types';
// import { useEffect, useState } from 'react';

// const data = [
//   {
//     Agency: 'Deprixa Miami',
//     Office: 'Miami - Florida',
//     'Logistics Service': 'Ocean Freight',
//   },
//   {
//     'Invoice date': 'Jun 15, 2023',
//     'Package Type': 'Flat small box',
//     'Courier Company': 'Cargus',
//   },
//   {
//     'Delivery time': 'TNT 10-14 DAYS',
//     'Payment Method': 'Cash on delivery',
//     'Shipping Mode': 'Next Day',
//   },
// ];

// export default function InvoiceDetails({ id }: { id: number }) {
//   const [data, setData] = useState<EventResponseData>();

//   useEffect(() => {
//     const fetchData = async (eventId: number) => {
//       try {
//         const resultData = (await viewEventDetail(
//           eventId
//         )) as CreateEventResponse;
//         console.log('Job request result data', resultData);
//         const data = resultData.data;
//         setData(data);
//       } catch (err: any) {
//         console.log('Error response for listing users', err.response);
//       }
//     };

//     fetchData(id); // Call fetchData when the component mounts
//   }, [id]);

//   return (
//     <div className="grid items-start rounded-xl border border-gray-300 p-5 @2xl:grid-cols-2 @3xl:grid-cols-3 @3xl:p-8 @5xl:grid-cols-4">
//       <ul className="grid gap-3 @3xl:col-span-full @3xl:mb-2 @5xl:col-span-1 @5xl:mb-0">
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">Event Name :</span>
//           <span className="text-base font-semibold text-gray-900">
//             {data?.name}
//           </span>
//         </li>
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">Event Date :</span>
//           <Badge color="primary" rounded="md">
//             {data?.date}
//           </Badge>
//         </li>
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">Event Id :</span>
//           <Badge color="success" rounded="md">
//             {data?.id}
//           </Badge>
//         </li>
//       </ul>
//       <ul className="mt-3 grid gap-3 @5xl:mt-0">
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">Expense :</span>
//           <span className="text-base font-semibold text-gray-900">
//             {data?.expense} Rupees
//           </span>
//         </li>
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">
//             Number of Participants :
//           </span>
//           <span className="text-base font-semibold text-gray-900">
//             {data?.no_of_participants}
//           </span>
//         </li>
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">Organized By :</span>
//           <Badge color="warning" rounded="md">
//             {data?.organised_by}
//           </Badge>
//         </li>
//       </ul>
//       <ul className="mt-3 grid gap-3 @5xl:mt-0">
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">
//             Event Description :
//           </span>
//           <span className="text-base font-semibold text-gray-900">
//             {data?.description}
//           </span>
//         </li>
//         <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
//           <span className="font-semibold text-gray-900">
//             Other Description :
//           </span>
//           <span className="text-base font-semibold text-gray-900">
//             {data?.other_description}
//           </span>
//         </li>
//       </ul>
//       {/* {data.map((item, index) => (
//         <ul key={index} className="mt-3 grid gap-3 @5xl:mt-0">
//           {Object.entries(item).map(([key, value]) => (
//             <li key={key} className="flex items-center gap-3">
//               <span className="font-semibold text-gray-900">{key} :</span>
//               <span>{value}</span>
//             </li>
//           ))}
//         </ul>
//       ))} */}
//     </div>
//   );
// }
