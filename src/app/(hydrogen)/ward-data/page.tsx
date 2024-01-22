import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/ward-data/roles-grid';
import UsersTable from '@/app/shared/ward-data/users-table';
import CreateRole from '@/app/shared/ward-data/create-role';

const pageHeader = {
  title: 'Input Ward Collection Data',
  breadcrumb: [
    {
      href: '/',
      name: 'Activities',
    },
    {
      name: 'Input Ward Collection Data',
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
