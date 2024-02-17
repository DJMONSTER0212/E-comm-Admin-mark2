'use client'
import React, { Suspense } from 'react'
import CredentialsSignin from './credentials-signin'
import GoogleSignin from './google'

const SigninMethods = ({ signinMethods }) => {
    const credentialsMethod = signinMethods.filter((method) => method.name == 'credentials');
    const socialMethods = signinMethods.filter((method) => method.name != 'credentials');
    return (
        <>
            {signinMethods.length > 0 ?
                <>
                    {credentialsMethod.length > 0 && <Suspense><CredentialsSignin /></Suspense>}
                    {signinMethods.length > 1 && <p className='text-sm text-muted-foreground text-center my-2'>OR</p>}
                    {socialMethods.length > 0 &&
                        <div className='grid grid-cols-1 gap-1'>
                            {socialMethods.map((method, index) => {
                                switch (method.name) {
                                    case 'google':
                                        return <Suspense><GoogleSignin key={index} title={'Sign in with google'} /></Suspense>
                                    default:
                                        break;
                                }
                            })}
                        </div>
                    }
                </> :
                <p>Sign in is disabled</p>
            }
        </>
    )
}

export default SigninMethods