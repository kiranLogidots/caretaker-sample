import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/position-category/roles-grid';
import UsersTable from '@/app/shared/position-category/users-table';
import CreateRole from '@/app/shared/position-category/create-role';

const pageHeader = {
  title: 'Position Categories',
  breadcrumb: [
    {
      href: '/',
      name: 'Overview',
    },
    {
      name: 'Position Categories',
    },
  ],
};

export default function BlankPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        {/* <ModalButton label="Add New Role" view={<CreateRole />} /> */}
      </PageHeader>
      {/* <RolesGrid /> */}
      <UsersTable data={usersData} />
    </>
  );
}
