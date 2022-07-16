import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import OutsideAction from './OutsideAction';

const Navbar = ({ avatar, balance }: { avatar: string; balance: number }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  return (
    <header>
      <nav className='relative min-w-screen px-8 py-4 flex justify-between items-center'>
        Dashboard
        <div className='flex items-center'>
          Balance: Rp {balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          <button className='ml-8 flex items-center' onClick={toggleMenu}>
            <Image className='rounded-full' src={avatar} alt='profile picture' width={36} height={36} />
          </button>
        </div>
        {expanded && (
          <ul className='absolute right-8 -bottom-16 w-24 bg-gray-800 rounded-sm text-sm text-white'>
            <OutsideAction action={toggleMenu}>
              <li className='p-2'>
                <button className='flex items-center' onClick={() => signOut({ callbackUrl: '/' })}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'>
                    <path
                      fill='currentcolor'
                      d='M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z'
                    />
                  </svg>
                  <span className='ml-2'>Sign out</span>
                </button>
              </li>
            </OutsideAction>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
