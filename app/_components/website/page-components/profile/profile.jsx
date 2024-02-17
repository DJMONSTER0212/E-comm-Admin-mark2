'use client'
import React from 'react'
import ChangeUserPassword from '@/app/_components/website/page-components/profile/change-password';
import EditUser from '@/app/_components/website/page-components/profile/edit';

const Profile = () => {
    return (
        <>
            <div className="mb-7">
                <h1 className='text-3xl font-bold leading-[1.5]'>Account settings</h1>
                <p className='text-base text-muted-foreground mt-1.5'>Edit your profile details, change password and more.</p>
            </div>
            <div className="grid grid-cols-1 gap-5">
                <EditUser user={{}} />
                <div className="grid grid-cols-1 gap-5 h-fit">
                    <ChangeUserPassword user={{}} />
                </div>
            </div>
        </>
    )
}

export default Profile