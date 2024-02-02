import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { metaObject } from '@/config/site.config';
import OrderView from '@/app/shared/ecommerce/order/order-view';
import JobRequestView from '@/app/shared/pickup-request/pickupreq-detail/request-view';

export const metadata = {
  ...metaObject('Job Request Details'),
};

export default function RequestDetailsPage({ params }: any) {
  const pageHeader = {
    title: 'Pickup Request Detail',
    breadcrumb: [
      {
        href: routes.pickUpRequest.dashboard,
        name: 'Job Request List',
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
      <JobRequestView id={params.slug}/>
    </>
  );
}
