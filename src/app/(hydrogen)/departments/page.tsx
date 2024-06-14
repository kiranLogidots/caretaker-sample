import UsersTable from '@/app/shared/departments/users-table';
import { usersData } from '@/data/users-data';

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
