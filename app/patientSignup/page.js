"use client";
import { useState, useEffect, useRef } from "react"
import { Toast } from 'primereact/toast'

import { auth, createUserWithEmailAndPassword, setDoc, doc, db } from '../../firebase.config'
import { createUser } from "../components/serverTrigger/serverTrigger";
import Link from 'next/link';
import { useMyContext } from "../layout"

export default function Home() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [ic, setIc] = useState("")
  const [walletPassword, setWalletPassword] = useState("")

  const toast = useRef(null)

  const { logIn, fetchSession } = useMyContext()


  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress")
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress)
    }
  }, []);

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      // Firebase Credential Storing
      createUserWithEmailAndPassword(auth, email, walletPassword)
        .then((userCredential) => {
          const user = userCredential.user
          console.log(user)
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          toast.current.show({ severity: 'error', summary: `Error Code: ${errorCode}`, detail: `${errorMessage}` })
        });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, ic }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user")
      }

      const result = await response.json()

      const walletAddress = result.result.wallet.wallet_address
      if (!walletAddress) {
        throw new Error("Wallet address not found in the response")
      }

      console.log(result)

      // Creates New Document Upon Registration
      await setDoc(doc(db, 'patients', result.result.user.email), {
        email: result.result.user.email,
        name: result.result.user.name,
        walletAddress: walletAddress
      })

      toast.current.show({ severity: 'success', summary: 'Success', detail: `Wallet: ${walletAddress} Created Successfully` });

      createUser({ email, walletAddress, name: result.result.user.name })
      fetchSession()
      logIn()

      closeModal()
    } catch (error) {
      console.error("Error creating user:", error)
      return
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Toast ref={toast} />
      {/* //==========================Health Dashboard========================== */}
      <div className="min-h-screen md:w-9/12 mt-10 flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center h-96 md:h-auto">
          <div className="text-center p-8">
            <h1 className="text-6xl font-bold text-white mb-4">Medata</h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="p-10 w-full max-w-sm">
            <h2 className="text-3xl font-bold mb-6">Patient Sign Up</h2>
            <p className="text-gray-500 mb-8">Welcome back! Please login to your account.</p>
            <form onSubmit={handleLogIn}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name  "
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
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
                <label htmlFor="ic" className="block text-sm font-medium text-gray-700">
                  IC
                </label>
                <input
                  type="text"
                  id="ic"
                  value={ic}
                  onChange={(e) => setIc(e.target.value)}
                  placeholder="010101141111"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="walletPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="walletPassword"
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
                type="submit"
                className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300"
              >
                Sign Up
              </button>
            </form>
            <div style={{ justifyContent: 'space-between' }} className="flex">
              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-purple-500 hover:text-purple-700">
                  Login
                </Link>
              </div>
              <div className="mt-6 text-center">
                <Link href="/doctorLogin" className="text-sm text-purple-500 hover:text-purple-700">
                  Doctor Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
