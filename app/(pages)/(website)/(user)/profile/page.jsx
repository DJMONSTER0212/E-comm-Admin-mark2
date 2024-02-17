import React from 'react'
import Profile from '@/app/_components/website/page-components/profile/profile';

const getValueAfter5Seconds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('hey there!');
    }, 2000);
  });
};

const page = async () => {
  const value = await getValueAfter5Seconds();
  return (
    <Profile />
  )
}

export default page