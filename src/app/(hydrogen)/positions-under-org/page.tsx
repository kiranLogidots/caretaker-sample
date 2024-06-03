import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/positions/roles-grid';
import UsersTable from '@/app/shared/positions-under-org/users-table';
import CreateRole from '@/app/shared/positions/create-role';
import CreateUser from '@/app/shared/positions-under-org/create-user';
import DrawerButton from '@/app/shared/drawer-button';

const pageHeader = {
  title: 'Positions',
  // breadcrumb: [
  //   {
  //     href: '/',
  //     name: 'Overview',
  //   },
  //   {
  //     name: 'Positions',
  //   },
  // ],
};

export default function BlankPage() {
  return (
    <>
      <PageHeader
        title={pageHeader.title}
      // breadcrumb={pageHeader.breadcrumb}
      >
        {/* <ModalButton label="Add New Role" view={<CreateRole />} /> */}
        <DrawerButton
          label="Add New Position"
          view={<CreateUser />}
          customSize="500px"
          placement="right"
        />
      </PageHeader>
      {/* <RolesGrid /> */}
      <UsersTable data={usersData} />
    </>
  );
}
