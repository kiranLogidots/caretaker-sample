import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/positions/roles-grid';
import UsersTable from '@/app/shared/positions/users-table';
import CreateRole from '@/app/shared/positions/create-role';

const pageHeader = {
  title: 'Positions',
  breadcrumb: [
    {
      href: '/',
      name: 'Users',
    },
    {
      name: 'Positions',
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
