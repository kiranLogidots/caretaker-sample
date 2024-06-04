import { Metadata } from 'next';
import PageHeader from '@/app/shared/page-header';
import OrgInfoView from '@/app/shared/account-settings/org-profile-settings';

// SEO metadata
export const metadata: Metadata = {
  title: 'New Page | Isomorphic Furyroad',
};

const pageHeader = {
  title: 'Organization Profile',
  // breadcrumb: [
  //   {
  //     href: '/',
  //     name: 'Home',
  //   },
  //   {
  //     name: 'NewPage',
  //   },
  // ],
};

export default function Organization_profile() {
  return (
    <>
      <PageHeader title={pageHeader.title} 
      // breadcrumb={pageHeader.breadcrumb} 
      />
      <OrgInfoView />
    </>
  );
}