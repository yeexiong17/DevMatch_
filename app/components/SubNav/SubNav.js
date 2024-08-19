import React from 'react'
import Link from 'next/link'

const SubNav = () => {
    return (
        <nav className="bg-white shadow-md w-full">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="rounded-full bg-purple-500 h-8 w-8 flex items-center justify-center mr-2">
                        <span className="text-white text-lg font-bold">M</span>
                    </div>
                    <span className="text-xl font-semibold">Medata Patient</span>
                </div>

                {/* Navigation Links */}
                <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">

                    <Link href="/patient">
                        <li>Patient Log</li>
                    </Link>
                    <Link href="/doctorInfo">
                        <li>Doctors Directory</li>
                    </Link>
                </ul>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search"
                            className="border border-gray-300 rounded-full py-1 px-4 text-sm focus:outline-none"
                        />
                    </div>
                    <div className="md:hidden">
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default SubNav
