"use client";
import { useState, useEffect } from "react"
import SubNav from '../components/SubNav/SubNav'

import Link from 'next/link'


export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress")
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress)
    }
  }, [])

  const [isAccessAllowed, setIsAccessAllowed] = useState(false)

  const handleAllowAccess = () => {
    setIsAccessAllowed(true)
  }

  const handleRemoveAccess = () => {
    setIsAccessAllowed(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      {/* navigation  */}
      <SubNav />
      <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-md">
        {/* Personal Information Section */}
        <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray' }} className="mb-6 rounded-md">
          <div className="bg-gray-100 p-4 rounded-md"><h2 className="text-xl font-semibold pb-4 border-b border-gray-300">Patient Medical History Information</h2></div>
          <div className="bg-gray-100 pl-4 pr-4 pt-0.5 rounded-md">
            {/* //======================================== Patient Database UI*/}
            <div className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-md">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=Anon" alt="Annoymous Patient" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    {/* TODO: linking here */}
                    <h2 className="text-2xl font-bold">Leong Ee Mun</h2>
                    <p className="text-gray-500">Tel: +6012-772 6269</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg"><strong>Age</strong></p>
                  <p>21</p>
                </div>
                <div>
                  <p className="text-lg"><strong>Date of Birth</strong></p>
                  <p>04/07/2003</p>
                </div>
                <div>
                  <p className="text-lg"><strong>Allergies</strong></p>
                  <p>Penicillin</p>
                </div>
                <div>
                  <p className="text-lg"><strong>Medical problems</strong></p>
                  <p>Asthma</p>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-6">
                {/* <ul className="flex space-x-4 text-blue-500">
                <li className="font-bold">Patient Medical History</li>
              </ul> */}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left Section */}
                <div className="col-span-1 lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">Medical History</h3>
                    <div className="p-4 bg-gray-100 rounded-md mb-4 ">
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {/* 1 div content  */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-4 bg-gray-100 rounded-md mb-4 border-b border-gray-300">
                          <div>
                            <p><strong>Diagnosis: </strong>Fever</p>
                            <p style={{ fontStyle: 'italic', color: '#808080' }} > Dr. John, Columbia Asia Hospital Setapak</p>
                          </div>
                          <div>
                            <p>09/07/2024</p>
                          </div>
                        </div>
                        {/* 2 div content  */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-4 bg-gray-100 rounded-md mb-4 border-b border-gray-300">
                          <div>
                            <p><strong>Diagnosis: </strong>Covid-19</p>
                            <p style={{ fontStyle: 'italic', color: '#808080' }} > Dr. Lim, Dr Lim Clinic</p>
                          </div>
                          <div>
                            <p>07/11/2021</p>
                          </div>
                        </div>
                        {/* 3 div content  */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-4 bg-gray-100 rounded-md mb-4 border-b border-gray-300">
                          <div>
                            <p><strong>Diagnosis: </strong>Discharge letter</p>
                            <p style={{ fontStyle: 'italic', color: '#808080' }} > Dr. Wong, Gleneagles Hospital Kuala Lumpur</p>
                          </div>
                          <div>
                            <p>21/10/2017</p>
                          </div>
                        </div>
                        {/* 4 div content  */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="p-4 bg-gray-100 rounded-md mb-4 border-b border-gray-300">
                          <div>
                            <p><strong>Diagnosis: </strong>Influenza A virus</p>
                            <p style={{ fontStyle: 'italic', color: '#808080' }} > Dr. Wong, Kuala Lumpur Hospital</p>
                          </div>
                          <div>
                            <p>16/10/2017</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div style={{ maxHeight: '330px', overflowY: 'auto' }} className="p-4 bg-gray-100 rounded-md">
                    <strong>Attended Doctor:</strong>
                    <p>Dr. John Lee</p><br></br>
                    <strong>Practice Address:</strong>
                    <p>Columbia Asia Hospital Setapak</p><br></br>
                    <strong>Date & Time:</strong>
                    <p>09/07/2024, 11.26 am</p><br></br>
                    <strong>Diagnosis:</strong>
                    <p>Fever</p><br></br>

                    <strong>Diagnosis Details:</strong>
                    <p>Diagnosed with fever, likely due to a viral infection, recommended rest, hydration, and antipyretics for symptom management.</p><br></br>
                    <strong>Medications Prescribed:</strong>
                    <p>Paracetamol (Panadol): 500 mg orally every 4-6 hours as needed for fever. Do not exceed 4,000 mg per day.
                      Acetaminophen (Tylenol): 500 mg orally every 4-6 hours as needed for fever. Do not exceed 3,000 mg per day.
                      Ibuprofen (Advil, Motrin): 400 mg orally every 4-6 hours as needed for fever. Do not exceed 3,200 mg per day.
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="text-right">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300">
                Save & Create
              </button>
            </div> */}
            </div>
            {/* //========================================End of Patient Database UI*/}

            <br></br>
            {/* <p><strong>Your records are stored here:</strong> 
            <a href="http://localhost:8080/ipfs/QmcJDvi2ext2kwGqny6XCU4nWzw2NXAasuKEFveo7BG49" className="text-blue-500 ml-2">
              Patient Database
            </a>
          </p> */}
            {/* <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">View medical records</button> */}

          </div>
        </div>

        {/* Share Medical Record Section */}
        <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray' }} className="mb-6 rounded-md">
          <div className="bg-gray-100 p-4 rounded-md"><h2 className="text-xl font-semibold pb-4 border-b border-gray-300">Allow Medical Record Access </h2></div>
          <div className="bg-gray-100 p-4 rounded-md">
            <label htmlFor="doctor" className="block mb-2"><strong>Doctor:</strong></label>
            <select id="doctor" className="p-2 border rounded-md w-full">
              <option>Dr John Lee</option>
              <option>Dr Lim Zi Xian</option>
              <option>Dr Wong Yee Xiong</option>
              <option>Dr Leong EM</option>
              <option>Dr Bevvy</option>
              <option>Dr Ang Lee</option>
              <option>Dr Azula</option>
            </select>

            <button onClick={handleAllowAccess} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
              Allow Access
            </button>
          </div>
        </div>

        {/* Doctor Access */}
        <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray' }} className="mb-6 rounded-md">
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold pb-4 border-b border-gray-300">Doctor Accessed</h2>

          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <table className="min-w-full bg-white border rounded-md">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 border-b">Doctor</th>
                  <th className="text-left py-2 px-4 border-b">Client Key</th>
                  <th className="text-left py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              {isAccessAllowed && (
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Dr John Lee</td>
                    <td className="py-2 px-4 border-b">0xb673a84b062a387925a210622bA66411Ef6e0a4e</td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={handleRemoveAccess} className="bg-red-500 text-white px-4 py-2 rounded-md">
                        Remove access
                      </button>
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
