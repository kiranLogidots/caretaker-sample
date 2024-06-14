import DepartmentPositionsTable from '@/app/shared/department-positions/users-table';
import UsersTable from '@/app/shared/departments/users-table';
import PageHeader from '@/app/shared/page-header';
import { usersData } from '@/data/users-data';

const pageHeader = {
  title: 'Department Position',
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
      <PageHeader
        title={pageHeader.title}
        // breadcrumb={pageHeader.breadcrumb}
      ></PageHeader>
      {/* <RolesGrid /> */}
      <DepartmentPositionsTable data={usersData} />
    </>
  );
}
