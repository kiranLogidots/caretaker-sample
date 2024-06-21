import { metaObject } from '@/config/site.config';
import ExecutiveDashboard from '@/app/shared/executive';
import FileDashboard from '@/app/shared/file/dashboard';

export const metadata = {
  ...metaObject('Executive Dashboard'),
};

export default function ExecutiveDashboardPage() {
  return (
    <>
      {/* <ExecutiveDashboard /> */}
      <FileDashboard />
    </>
  );
}
