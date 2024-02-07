import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { metaObject } from '@/config/site.config';
import OrderView from '@/app/shared/ecommerce/order/order-view';
import JobRequestView from '@/app/shared/pickup-request/pickupreq-detail/request-view';
import EventImageGallery from '@/app/shared/events-hks/event-detail/event-images';
import InvoiceDetails from '@/app/shared/events-hks/event-detail/event-data';

export const metadata = {
  ...metaObject('Job Request Details'),
};

export default function RequestDetailsPage({ params }: any) {
  const pageHeader = {
    title: 'Event Details',
    breadcrumb: [
      {
        href: routes.pickUpRequest.dashboard,
        name: 'Events',
      },
      {
        href: routes.pickUpRequest.dashboard,
        name: 'View Detail Page',
      },
      {
        name: params.slug,
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      {/* <ProductDetails /> */}
      {/* <JobRequestView id={params.slug}/> */}
      Event detail page
      <div className="mt-2 flex flex-col gap-y-6 @container sm:gap-y-10">
        <InvoiceDetails id={params.slug}/>
        <EventImageGallery id={params.slug}/>
      </div>
    </>
  );
}
