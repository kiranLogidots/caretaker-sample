'use client';

import Link from 'next/link';
import HamburgerButton from '@/layouts/hamburger-button';
import SearchWidget from '@/components/search/search';
import Sidebar from '@/layouts/hydrogen/sidebar';
import Logo from '@/components/logo';
import HeaderMenuRight from '@/layouts/header-menu-right';
import StickyHeader from '@/layouts/sticky-header';
import Image from 'next/image';
import GWLogo from "../../../public/logo_greenworms.svg";

export default function Header() {
  return (
    <StickyHeader className="2xl:py-5 3xl:px-8 4xl:px-10 flex justify-between">
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
          <Image src={GWLogo} className='w-[205px]' alt="Greenworms logo"/>
        </Link>

        <SearchWidget />
      </div>
      <HeaderMenuRight />
    </StickyHeader>
  );
}
