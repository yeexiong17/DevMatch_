"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from 'next/link';

import HealthConnectLogo from '../image/HealthConnect.png';


export default function Home() {
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
      // Don't send the request if there's an error
      return;
    }
  };

  const [patientId, setPatientId] = useState('');
  const [authCode, setAuthCode] = useState('');

  const handleSearch = () => {
    // Implement search functionality here
    console.log(`Searching for Patient ID: ${patientId} with Auth Code: ${authCode}`);
  };

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      

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
          <h2 className="text-3xl font-bold mb-6">Patient Login</h2>
          <p className="text-gray-500 mb-8">Welcome back! Please login to your account.</p>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>              
              <input
                type="text"
                id="name"
                placeholder="Your Name  "
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>              
              <input
                type="text"
                id="email"
                placeholder="useremail@gmail.com"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                IC
              </label>              
              <input
                type="text"
                id="IC"
                placeholder="010101141111"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="**********"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
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
            <Link href="/patient">
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300"
            >
              Login
            </button>
            </Link>
          </form>
          <div style={{justifyContent: 'space-between'}}className="flex">
                <div className="mt-6 text-center">
                    <Link href="/patientSignup" className="text-sm text-purple-500 hover:text-purple-700">
                    SignUp
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
