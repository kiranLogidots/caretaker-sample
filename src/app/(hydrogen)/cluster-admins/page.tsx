import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/cluster-admins/roles-grid';
import UsersTable from '@/app/shared/cluster-admins/users-table';
import CreateRole from '@/app/shared/cluster-admins/create-role';

const pageHeader = {
  title: 'Cluster Admins',
  breadcrumb: [
    {
      href: '/',
      name: 'Users',
    },
    {
      name: 'Cluster Admins',
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
