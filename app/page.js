"use client";
import { useState, useEffect, useContext } from "react";
import MintTokenModal from "./components/Mint-token";
import TransferTokenModal from "./components/Transfer-token";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createUser, getSession, handleServerLogOut } from "./components/serverTrigger/serverTrigger";
import { useMyContext } from "./layout";

import Link from 'next/link';


export default function Home() {

  const { logOut } = useMyContext()

  const [walletAddress, setWalletAddress] = useState(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const clearWalletAddress = () => {
    sessionStorage.removeItem("walletAddress");
    setWalletAddress(null);
  };

  //fix function here late
  const handleMintSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/mint`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mint token");
      }

      const result = await response.json();
      console.log("Token Minted:", result);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Minted token successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeModal();
    } catch (error) {
      console.error("Error minting token:", error);
      toast.error("🦄 Error minting token", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Don't send the request if there's an error
      return;
    }
  };

  //fix function here late
  const handleTransferSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/token-transfer`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transfer token");
      }

      const result = await response.json();
      console.log("Transfered Token:", result);
      // const walletAddress = result.result.wallet.wallet_address;
      // //   console.log("Wallet address:", walletAddress);
      // // Store the wallet address in sessionStorage
      // sessionStorage.setItem("walletAddress", walletAddress);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 Token transfered successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeModal();
    } catch (error) {
      console.error("Error transfering token:", error);
      toast.error("🦄 Error transfering token", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  };

  const [patientId, setPatientId] = useState('');
  const [authCode, setAuthCode] = useState('');

  const handleSearch = () => {
    // Implement search functionality here
    console.log(`Searching for Patient ID: ${patientId} with Auth Code: ${authCode}`);
  };

  const handleLogOut = () => {
    handleServerLogOut()
    logOut()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      {/* //==========================Navigation========================== */}
      <nav className="bg-white shadow-md w-full">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="rounded-full bg-purple-500 h-8 w-8 flex items-center justify-center mr-2">
              <span className="text-white text-lg font-bold">M</span>
            </div>
            <span className="text-xl font-semibold">Medata Doctor</span>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">

            <Link href="/">
              <li>Dashboard</li>
            </Link>

            <Link href="/doctor">
              <li>Patient Log</li>
            </Link>

            <Link href="/login">
              <li>Login As Patient</li>
            </Link>
          </ul>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="">
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

      {/* //==========================Health Dashboard========================== */}

      <div className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold mb-6">Doctor Dashboard Overview</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Scheduling Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Scheduling</h3>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm font-medium">Appointments</p>
              <p className="text-xl font-bold">12</p>
              <p className="text-xs text-gray-500">Last Updated: 1 hour ago</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm font-medium">Roster</p>
              <p className="text-xl font-bold">2</p>
              <p className="text-xs text-gray-500">Last Updated: 2 weeks ago</p>
            </div>
          </div>

          {/* Records Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Records</h3>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm font-medium">Patients</p>
              <p className="text-xl font-bold">128</p>
              <p className="text-xs text-gray-500">Last Updated: 2 min ago</p>
            </div>
          </div>

          {/* Financial Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Financial</h3>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm font-medium">Billing</p>
              <p className="text-xl font-bold">24</p>
              <p className="text-xs text-gray-500">Last Updated: 2 days ago</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm font-medium">Invoices</p>
              <p className="text-xl font-bold">36</p>
              <p className="text-xs text-gray-500">Last Updated: 1 week ago</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm font-medium">Insurance</p>
              <p className="text-xl font-bold">87</p>
              <p className="text-xs text-gray-500">Last Updated: 3 hours ago</p>
            </div>
          </div>



          {/* Contacts Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contacts</h3>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm font-medium">Staff</p>
              <p className="text-xl font-bold">62</p>
              <p className="text-xs text-gray-500">Last Updated: 2 days ago</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm font-medium">Pharmacy</p>
              <p className="text-xl font-bold">25</p>
              <p className="text-xs text-gray-500">Last Updated: 4 days ago</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm font-medium">Hospital</p>
              <p className="text-xl font-bold">17</p>
              <p className="text-xs text-gray-500">Last Updated: 3 hours ago</p>
            </div>
          </div>

        </div>

        {/* Notifications Section */}

        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div style={{ backgroundColor: '#45586a' }} className="bg-gray-100 p-4 rounded-md">
            <p className="text-bg font-medium text-white pb-2">New patient data received</p>
            <div style={{ display: 'flex' }}>
              <div>
                <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Annoymous Patient" className="w-10 h-10 rounded-full mr-4" />
              </div>
              <div>
                <p className="text-sm text-white">Lim Zi Xian - 15:30, 17 Aug 2024</p>
                <button className="text-blue-500 text-sm mt-1">View Details</button>
              </div>
            </div>
          </div><br></br>
          <div style={{ backgroundColor: '#45586a' }} className="bg-gray-100 p-4 rounded-md">
            <p className="text-bg font-medium text-white pb-2">New patient data received</p>
            <div style={{ display: 'flex' }}>
              <div>
                <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Annoymous Patient" className="w-10 h-10 rounded-full mr-4" />
              </div>
              <div>
                <p className="text-sm text-white">Leong Ee Mun - 09:30, 17 Aug 2024</p>
                <button className="text-blue-500 text-sm mt-1">View Details</button>
              </div>
            </div>
          </div><br></br>
          <div style={{ backgroundColor: '#45586a' }} className="bg-gray-100 p-4 rounded-md">
            <p className="text-bg font-medium text-white pb-2">Patient revoking access</p>
            <div style={{ display: 'flex' }}>
              <div>
                <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Annoymous Patient" className="w-10 h-10 rounded-full mr-4" />
              </div>
              <div>
                <p className="text-sm text-white">Bevvy - 09:30, 17 Aug 2024</p>
                <button className="text-blue-500 text-sm mt-1">View Details</button>
              </div>
            </div>
          </div><br></br>
        </div>
      </div>
      {/* //========================================================================== */}

      <p className="text-sm text-gray-500 lowercase font-normal mt-4">
        {walletAddress ? (
          <>
            {`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={clearWalletAddress}
                className="w-full mt-4 border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Disconnect Wallet
              </button>
              <button
                onClick={openMintModal}
                className="mt-4 border w-full rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Mint Token
              </button>

              <button
                onClick={openTransferModal}
                className="mt-4 w-full border rounded-md py-2 px-4 hover:bg-black hover:text-white transition-all duration-300"
              >
                Transfer Token
              </button>
            </div>
          </>
        ) : (
          "Create Wallet to Get Started"
        )}
      </p>
      <AnimatePresence>
        {isMintModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MintTokenModal
              onSubmit={handleMintSubmit}
              onClose={closeMintModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTransferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <TransferTokenModal
              onSubmit={handleTransferSubmit}
              onClose={closeTransferModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
}
