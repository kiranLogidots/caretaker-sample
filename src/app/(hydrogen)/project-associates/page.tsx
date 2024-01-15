import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/project-associates/roles-grid';
import UsersTable from '@/app/shared/project-associates/users-table';
import CreateRole from '@/app/shared/project-associates/create-role';

const pageHeader = {
  title: 'Project Associates',
  breadcrumb: [
    {
      href: '/',
      name: 'Users',
    },
    {
      name: 'Project Associates',
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
