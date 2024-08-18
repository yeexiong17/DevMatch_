"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from 'next/link';


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

  const [isDoctorRecordVisible, setIsDoctorRecordVisible] = useState(false);

  const toggleDoctorRecordVisibility = () => {
    setIsDoctorRecordVisible(!isDoctorRecordVisible);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
        {/* navigation  */}
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
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="border border-gray-300 rounded-full py-1 px-4 text-sm focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center">
                      <Link href="/login">
                        <span className="text-sm font-medium">Log Out</span>
                      </Link>
                    </div>
                    <div className="md:hidden">
                    </div>
                </div>
            </div>
        </nav>  
        {/* Doctor List  row 1*/}
        <div className="flex items-center justify-center">
            <div className="border rounded-lg p-4 shadow-lg m-6">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Anonymous Patient" className="w-50 h-50 mr-4" />
                </div>
                    
                <h2 className="text-lg font-semibold text-center">Dr. John Lee Xing</h2>
                <p className="text-center text-sm">Pediatrician</p>
                <p className="text-center text-sm text-gray-500">Dr John Clinic Setapak</p>
                <div className="flex justify-center space-x-2 my-4">
                    <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs">
                        in-person
                    </span>
                    <span className="bg-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs">
                        Virtual
                    </span>
                </div>
                <div className="text-center text-sm mb-4">
                </div>
                <div className="text-center">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mb-2 w-full">
                        Book Consultation
                    </button>

                    <button 
                        onClick={toggleDoctorRecordVisibility} 
                        className={`px-4 py-2 rounded-md w-full ${isDoctorRecordVisible ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        >
                        {isDoctorRecordVisible ? 'Hide View' : 'View More'}
                    </button>
                    {isDoctorRecordVisible && (
                        <div className="mt-5" style={{width: '290px', height: '100px', overflowY: 'auto' }}>  
                            <h4 className="flex justify-left italic"><strong>Experience Overview</strong></h4>                              
                            <p>blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="border rounded-lg p-4 shadow-lg m-6">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Anonymous Patient" className="w-50 h-50 mr-4" />
                </div>
                    
                <h2 className="text-lg font-semibold text-center">Dr. Wong Yee Xiong</h2>
                <p className="text-center text-sm">Cardiologist</p>
                <p className="text-center text-sm text-gray-500">Hospital Bukit Jalil</p>
                <div className="flex justify-center space-x-2 my-4">
                    <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs">
                        in-person
                    </span>
                    <span className="bg-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs">
                        Virtual
                    </span>
                </div>
                <div className="text-center text-sm mb-4">
                </div>
                <div className="text-center">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mb-2 w-full">
                        Book Consultation
                    </button>

                    <button 
                        onClick={toggleDoctorRecordVisibility} 
                        className={`px-4 py-2 rounded-md w-full ${isDoctorRecordVisible ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        >
                        {isDoctorRecordVisible ? 'Hide View' : 'View More'}
                    </button>
                    {isDoctorRecordVisible && (
                        <div className="mt-5" style={{width: '290px', height: '100px', overflowY: 'auto' }}>  
                            <h4 className="flex justify-left italic"><strong>Experience Overview</strong></h4>                              
                            <p>blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="border rounded-lg p-4 shadow-lg m-6">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Anonymous Patient" className="w-50 h-50 mr-4" />
                </div>
                    
                <h2 className="text-lg font-semibold text-center">Dr. Leong Ee Mun</h2>
                <p className="text-center text-sm">Dermatologist</p>
                <p className="text-center text-sm text-gray-500">Gleneagles Kuala Lumpur</p>
                <div className="flex justify-center space-x-2 my-4">
                    <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs">
                        in-person
                    </span>
                    <span className="bg-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs">
                        Virtual
                    </span>
                </div>
                <div className="text-center text-sm mb-4">
                </div>
                <div className="text-center">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mb-2 w-full">
                        Book Consultation
                    </button>

                    <button 
                        onClick={toggleDoctorRecordVisibility} 
                        className={`px-4 py-2 rounded-md w-full ${isDoctorRecordVisible ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        >
                        {isDoctorRecordVisible ? 'Hide View' : 'View More'}
                    </button>
                    {isDoctorRecordVisible && (
                        <div className="mt-5" style={{width: '290px', height: '100px', overflowY: 'auto' }}>  
                            <h4 className="flex justify-left italic"><strong>Experience Overview</strong></h4>                              
                            <p>blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="border rounded-lg p-4 shadow-lg m-6">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Anonymous Patient" className="w-50 h-50 mr-4" />
                </div>
                    
                <h2 className="text-lg font-semibold text-center">Dr. Bevvy Pang Ee Tong</h2>
                <p className="text-center text-sm">Neurologist</p>
                <p className="text-center text-sm text-gray-500">Hospital Kuala Lumpur</p>
                <div className="flex justify-center space-x-2 my-4">
                    <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs">
                        in-person
                    </span>
                    <span className="bg-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs">
                        Virtual
                    </span>
                </div>
                <div className="text-center text-sm mb-4">
                </div>
                <div className="text-center">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mb-2 w-full">
                        Book Consultation
                    </button>

                    <button 
                        onClick={toggleDoctorRecordVisibility} 
                        className={`px-4 py-2 rounded-md w-full ${isDoctorRecordVisible ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        >
                        {isDoctorRecordVisible ? 'Hide View' : 'View More'}
                    </button>
                    {isDoctorRecordVisible && (
                        <div className="mt-5" style={{width: '290px', height: '100px', overflowY: 'auto' }}>  
                            <h4 className="flex justify-left italic"><strong>Experience Overview</strong></h4>                              
                            <p>blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* todo later: individual change view  */}
        
        {/* Doctor List  row 2*/}

        
    
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
