import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/organizations/roles-grid';
import UsersTable from '@/app/shared/organizations/users-table';
import CreateRole from '@/app/shared/organizations/create-role';

const pageHeader = {
  title: 'Organizations',
  breadcrumb: [
    {
      href: '/',
      name: 'Overview',
    },
    {
      name: 'Organizations  ',
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
