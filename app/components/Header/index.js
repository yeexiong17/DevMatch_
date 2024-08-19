"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from 'primereact/toast';
import { redirect } from "next/navigation";

import CreateWalletModal from "../Create-wallet";
import { auth, createUserWithEmailAndPassword } from '../../../firebase.config'
import { createUser, getSession, handleServerLogOut } from "../serverTrigger/serverTrigger";
import { useMyContext } from "../../layout";


const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [logOutDropdown, setLogOutDropdown] = useState(false)

  const { logIn, logOut, isLoggedIn, loggedInUser, fetchSession } = useMyContext()

  const toast = useRef(null)
  const dropdownRef = useRef(null);

  const openSignUp = () => {
    window.location.href = '/patientSignup'
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleLogOutDropdown = () => {
    setLogOutDropdown(prevState => !prevState);
  }

  const handleLogOut = () => {
    handleServerLogOut()
    logOut()
    setLogOutDropdown(false)
  }

  const handleSubmit = async (data) => {

    const { name, email, ic, walletName, walletPassword } = data

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, ic, walletName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();

      createUserWithEmailAndPassword(auth, email, walletPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.current.show({ severity: 'error', summary: `Error Code: ${errorCode}`, detail: `${errorMessage}` });
        });

      const walletAddress = result.result.wallet.wallet_address;

      toast.current.show({ severity: 'success', summary: 'Success', detail: `Wallet: ${walletAddress} Created Successfully` });
      createUser({ walletAddress, name: result.result.user.name })

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      closeModal();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: `Error Creating Wallet` });
      return;
    }
    finally {
      fetchSession()
      logIn()
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLogOutDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, [])


  return (
    <header className="w-full py-6 lg:py-4 relative border-b">
      <Toast ref={toast} />
      <div className="container mx-auto px-8 lg:px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Health Logo Here</h1>
        </div>

        <div className="relative">
          <button
            onClick={isLoggedIn ? toggleLogOutDropdown : openSignUp}
            className="border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
          >
            {loggedInUser?.walletAddress ? `${loggedInUser.walletAddress.slice(0, 6)}...${loggedInUser.walletAddress.slice(-4)}` : "Create Wallet"}
          </button>
          {logOutDropdown && (
            <div ref={dropdownRef} className='z-50 absolute right-0 top-12 py-1 px-2 w-48 rounded-sm bg-white border shadow'>
              <button onClick={handleLogOut} className="w-full px-2 py-2 rounded-md text-left hover:bg-gray-200 duration-200">Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
