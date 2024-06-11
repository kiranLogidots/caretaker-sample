'use client';

import Link from 'next/link';
import HamburgerButton from '@/layouts/hamburger-button';
import SearchWidget from '@/components/search/search';
import Sidebar from '@/layouts/hydrogen/sidebar';
import Logo from '@/components/logo';
import HeaderMenuRight from '@/layouts/header-menu-right';
import StickyHeader from '@/layouts/sticky-header';
import Image from 'next/image';
import SHLogo from '../../../public/nexsysi-logo.png';
import HeaderLogo from '../../../public/rosterbees-logo.png'
import { useActiveMenu } from './ActiveMenuContext';
import { IoSettingsOutline } from 'react-icons/io5';

export default function Header() {
  const { activeMenuName } = useActiveMenu();
  return (
    <StickyHeader className="flex justify-between py-3 shadow-md 3xl:px-8 4xl:px-10">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={<Sidebar className="static w-full 2xl:w-full" />}
        />
        <Link
          href={'/'}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          {/* <Logo iconOnly={true} /> */}
          <Image src={HeaderLogo} className="w-[205px]" alt="CareTaker Logo" />
        </Link>
        <text className=' text-2xl font-bold mr-2'>{activeMenuName}</text>

        {/* <SearchWidget /> */}
      </div>
      <HeaderMenuRight />
    </StickyHeader>
  );
}
