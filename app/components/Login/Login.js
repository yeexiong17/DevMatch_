"use client"
import React from 'react'
import { useState, useRef } from "react"
import { Toast } from 'primereact/toast'

import { db, auth, doc, getDoc, signInWithEmailAndPassword } from '../../../firebase.config'
import { createUser, createDoc } from "../serverTrigger/serverTrigger"
import { useMyContext } from "../../layout"
import Link from 'next/link'

import HealthConnectLogo from '../../image/HealthConnect.png'

const Login = ({ role }) => {

    const [email, setEmail] = useState("")
    const [walletPassword, setWalletPassword] = useState("")

    const { logIn, fetchSession } = useMyContext()

    const toast = useRef(null)

    const handleLogIn = (e) => {
        e.preventDefault()

        // Firebase Authentication
        signInWithEmailAndPassword(auth, email, walletPassword)
            .then(async (userCredential) => {
                const user = userCredential.user
                console.log(user.email)

                // Get User Info From Firebase
                const docRef = doc(db, role == 'Patient' ? 'patients' : 'doctors', user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    let userData = docSnap.data()

                    toast.current.show({ severity: 'success', summary: 'Success', detail: `Wallet: ${userData.walletAddress} Logged In Successfully` })

                    // Creates Session For Logged In User
                    role == 'Patient' ? createUser({ email: userData.email, walletAddress: userData.walletAddress, name: userData.name }) : createDoc({ walletAddress: userData.walletAddress, name: userData.name })
                    fetchSession()
                    logIn()
                } else {
                    throw new Error("User Data Not Found");
                }
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                toast.current.show({ severity: 'error', summary: `Error Code: ${errorCode}`, detail: `Please Login Again! ${errorMessage}` })
            })
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <Toast ref={toast} />
            {/* //==========================Health Dashboard========================== */}
            <div className="min-h-screen mt-10 flex flex-col md:flex-row">
                {/* Left Side */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center h-96 md:h-auto">
                    <div>
                        <img src={HealthConnectLogo} alt="HealthConnect Logo" className="w-20 h-auto" />
                    </div>
                    <div className="text-center p-8">
                        <h1 className="text-6xl font-bold text-white mb-4">Medata</h1>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="p-10 w-full max-w-sm">
                        <h2 className="text-3xl font-bold mb-6">{role} Login</h2>
                        <p className="text-gray-500 mb-8">Welcome back! Please login to your account.</p>
                        <form onSubmit={handleLogIn}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="useremail@gmail.com"
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={walletPassword}
                                    onChange={(e) => setWalletPassword(e.target.value)}
                                    placeholder="**********"
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-500" />
                                    <span className="ml-2 text-sm text-gray-600">Remember Me</span>
                                </label>
                                <a href="#" className="text-sm text-purple-500 hover:text-purple-700">
                                    Forgot Password?
                                </a>
                            </div>
                            <button
                                onClick={handleLogIn}
                                className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300"
                            >
                                Login
                            </button>
                        </form>
                        <div style={{ justifyContent: 'space-between' }} className="flex">
                            <div className="mt-6 text-center">
                                <Link href={`/${role == 'Patient' ? 'patientSignup' : 'doctorSignup'}`} className="text-sm text-purple-500 hover:text-purple-700">
                                    SignUp
                                </Link>
                            </div>
                            <div className="mt-6 text-center">

                                <Link href={`/${role == 'Patient' ? 'login' : 'doctorLogin'}`} className="text-sm text-purple-500 hover:text-purple-700">
                                    {role == 'Patient' ? 'Doctor' : 'Patient'} Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login
