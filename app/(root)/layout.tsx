import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {

    const isUserAuthenticated = await isAuthenticated()

    // all non logged in cant see the home page
    if (!isUserAuthenticated) {
        redirect("/sign-in")
    }

    return (
        <div className='root-layout'>
            <nav>
                <Link href={"/"} className='flex items-center gap-2 '>
                    <Image src={"/logo.svg"} alt='logo' width={40} height={34} />
                    <h2 className='text-primary-100'>TactIQ</h2>
                </Link>
            </nav>
            {children}
        </div>
    )
}

export default RootLayout