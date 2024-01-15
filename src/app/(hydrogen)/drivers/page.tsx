import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/drivers/roles-grid';
import UsersTable from '@/app/shared/drivers/users-table';
import CreateRole from '@/app/shared/drivers/create-role';

const pageHeader = {
  title: 'Drivers',
  breadcrumb: [
    {
      href: '/',
      name: 'Users',
    },
    {
      name: 'Drivers ',
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
