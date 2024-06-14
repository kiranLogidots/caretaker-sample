import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/departments/roles-grid';
import UsersTable from '@/app/shared/departments/users-table';
import CreateRole from '@/app/shared/departments/create-role';
import DrawerButton from '@/app/shared/drawer-button';
import CreateUser from '@/app/shared/departments/create-user';

const pageHeader = {
  title: 'Departments',
  // breadcrumb: [
  //   {
  //     href: '/',
  //     name: 'Overview',
  //   },
  //   {
  //     name: 'Departments',
  //   },
  // ],
};

export default function BlankPage() {
  return (
    <>
      {/* <PageHeader
        title={pageHeader.title}
      >
          <DrawerButton
            label="Add New Department"
            view={<CreateUser />}
            customSize="500px"
            placement="right"
          />
      </PageHeader> */}
      {/* <RolesGrid /> */}
      <UsersTable data={usersData} />
    </>
  );
}
