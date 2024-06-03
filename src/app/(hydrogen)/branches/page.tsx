import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/branches/roles-grid';
import UsersTable from '@/app/shared/branches/users-table';
import CreateRole from '@/app/shared/branches/create-role';
import DrawerButton from '@/app/shared/drawer-button';
import CreateUser from '@/app/shared/branches/create-user';

const pageHeader = {
  title: 'Locations',
  // breadcrumb: [
  //   {
  //     href: '/',
  //     name: 'Overview',
  //   },
  //   {
  //     name: 'Locations',
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
            label="Add New Location"
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
