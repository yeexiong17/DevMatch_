"use client"
import { useState, useEffect } from "react"
import Link from 'next/link'
import { Dialog } from 'primereact/dialog';

import { query, collection, db, getDocs } from '../../firebase.config'
import { useMyContext } from '../layout'
import Option from '../../Option'
import moment from "moment";

export default function Home() {

  const { logIn, isLoggedIn, loggedInUser, fetchSession } = useMyContext()

  // List of patients that doctor have access to
  const [patientWithAccess, setPatientWithAccess] = useState(null)

  const [isRecordVisible, setIsRecordVisible] = useState(false)
  const [isPatientRecordVisible, setIsPatientRecordVisible] = useState(false)

  // New Medical Record Input Value
  const [diagnosis, setDiagnosis] = useState("")
  const [details, setDetails] = useState("")
  const [prescription, setPrescription] = useState("")

  // If dialog is visible or not 
  const [dialogVisible, setDialogVisible] = useState(false)

  // Selected Patient's Personal Information
  const [currentPatient, setCurrentPatient] = useState(null)

  // Selected Patient's Medical Records
  const [currentPatientRecord, setCurrentPatientRecord] = useState([])

  useEffect(() => {
    getPatientWithAccess()
  }, [])

  const getPatientWithAccess = async () => {
    const q = query(collection(db, "patients"));

    let doctorObject = []
    let patientList = []

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((patient) => {

      let patientData = patient.data()

      doctorObject.push(patientData.doctorAccess)

      let doesDoctorHaveAccess = doctorObject[0].some((doctor) => doctor.walletAddress == loggedInUser.walletAddress)

      if (doesDoctorHaveAccess) {
        patientList.push({ email: patientData.email, name: patientData.name, walletAddress: patientData.walletAddress })
      }

      doctorObject = []
    })
    setPatientWithAccess(patientList)
  }

  const togglePatientRecordVisibility = () => {
    setIsPatientRecordVisible(!isPatientRecordVisible)
  }

  const handleNewMedicalRecord = async () => {

    console.log({ diagnosis, details, prescription, date: new Date().toLocaleString().replace(',', '') })

    if (!diagnosis || !details || !prescription) return alert('Please Fill In All Required Fields!')

    let body = {
      wallet_address: loggedInUser.walletAddress,
      contract_address: "0xa965aDE1D9Ba5Ba99E8e2Fd80864f98abb39C1C2",
      metadata: {
        patient: currentPatient.walletAddress,
        diagnosis: [diagnosis],
        details: details,
        prescription: prescription,
        consultation_date: moment.format('DD/MM/YYYY hh:mm:ss A')
      },
      tag_id: [13],
      callback_url: 'https://postman-echo.com/post?'
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit/audit`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error("Error Creating New Medical Record")
      }

      try {
        setCurrentPatientRecord([])
        setCurrentPatientRecord(await getPatientRecord(currentPatient.walletAddress))

        alert("New Medical Record Created Successfully")
      } catch (error) {
        console.error('Error fetching patient record:', error)
      }
      finally {
        setDiagnosis("")
        setDetails("")
        setPrescription("")
      }

    } catch (error) {
      alert(error)
    }
  }

  const getPatientRecord = async (walletAddress) => {

    let patientData = null

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit/audit?tag=13`, {
      method: 'GET',
      headers: {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error("Failed To Get Patient Record")
    }

    const result = await response.json()

    patientData = result.result.filter((record) => {
      let metadata = record.metadata
      let parseMetadata = JSON.parse(metadata)

      return parseMetadata.patient == walletAddress
    })
      .map((record) => {
        const parsedData = JSON.parse(record.metadata)

        return parsedData
      })

    console.log(patientData)

    return patientData
    // const metadata = JSON.parse(result.result[0].metadata)
  }

  const toggleDialogVisibility = async (patient) => {
    setDialogVisible(true)
    setIsRecordVisible(!isRecordVisible)
    setCurrentPatient(patient)

    try {
      setCurrentPatientRecord(await getPatientRecord(patient.walletAddress))
    } catch (error) {
      console.error('Error fetching patient record:', error)
    }
  }

  const onDialogClose = () => {
    if (!dialogVisible) return

    setDialogVisible(false)
    setIsRecordVisible(false)
    setIsPatientRecordVisible(false)

    setCurrentPatient(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center ">
      {/* // shadow-lg rounded-md */}

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


      <div className="container mt-10 pl-10 pr-10 bg-white">
        {/* Personal Information Section */}
        <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray' }} className="mb-6 rounded-md">
          <div className="bg-gray-100 p-4 rounded-md"><h2 className="text-xl font-semibold pb-4 border-b border-gray-300">Doctor's Personal Information</h2></div>
          <div className="bg-gray-100 p-4 rounded-md">
            <table className="min-w-full bg-white border rounded-md">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 border-b">Name</th>
                  <th className="text-left py-2 px-4 border-b">Gender</th>
                  <th className="text-left py-2 px-4 border-b">Age</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* change here  */}
                  <td className="py-2 px-4 border-b">Dr {loggedInUser.name}</td>
                  <td className="py-2 px-4 border-b">Male</td>
                  <td className="py-2 px-4 border-b">55</td>
                  <td className="py-2 px-4 border-b">
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accessible Patients */}
        <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray' }} className="mb-6 rounded-md">
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold pb-4 border-b border-gray-300">Accessible Patient Record</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
            <table className="min-w-full bg-white border border-gray-300 rounded-md mb-4">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 border-b">Patient</th>
                  <th className="text-left py-2 px-4 border-b">Client Key</th>
                  <th className="text-left py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {patientWithAccess && patientWithAccess.length > 0 ? (
                  patientWithAccess.map((patient, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{patient.name}</td>
                      <td className="py-2 px-4 border-b">{patient.walletAddress}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => toggleDialogVisibility(patient)}
                          className={`px-4 py-2 rounded-md bg-blue-500 text-white`}
                        >
                          Manage Records
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 border-b text-center">No patient available</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Popup For Viewing Patient Medical Record */}
            <Dialog className="w-full lg:w-9/12" header="Patient's Record" visible={dialogVisible} onHide={() => onDialogClose()} draggable={false} resizable={false}>
              {isRecordVisible && (
                <div className="p-4 bg-white rounded-md border border-gray-300 mb-4">
                  <table className="min-w-full bg-white border border-gray-300 rounded-md mb-4">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 border-b">Patient</th>
                        <th className="text-left py-2 px-4 border-b">Client Key</th>
                        <th className="text-left py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">{currentPatient.name}</td>
                        <td className="py-2 px-4 border-b">{currentPatient.walletAddress.slice(0, 6)}...{currentPatient.walletAddress.slice(-4)}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={togglePatientRecordVisibility}
                            className={`px-4 py-2 rounded-md ${isPatientRecordVisible ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                          >
                            {isPatientRecordVisible ? 'Hide Patient Past Records' : 'View Past Records'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {isPatientRecordVisible && (
                    <div style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray' }} className="mb-6 rounded-md">
                      <div className="bg-gray-100 p-4 rounded-md"><h2 className="text-xl font-semibold pb-4 border-b border-gray-300">Patient Medical Information</h2></div>
                      <div className="bg-gray-100 pl-4 pr-4 pt-0.5 rounded-md">
                        {/* //======================================== Patient Database UI*/}
                        <div className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-md">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                              <div>
                                {/* TODO: linking here */}
                                <h2 className="text-2xl font-bold">{currentPatient.name}</h2>
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
                          </div>

                          <div className="border-b border-gray-200 mb-6">
                            {/* <ul className="flex space-x-4 text-blue-500">
                      <li className="font-bold">Patient Medical History</li>
                    </ul> */}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {/* Left Section */}
                            <div className="col-span-1 lg:col-span-2">
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold">Medical History</h3>
                                <div className="p-4 bg-gray-100 rounded-md mb-4 ">
                                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {
                                      currentPatientRecord.length > 0 ? (
                                        currentPatientRecord.map((record, index) => (
                                          <div
                                            key={index}
                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                            className="p-4 bg-gray-100 rounded-md mb-4 border-b border-gray-300"
                                          >
                                            <div>
                                              <p><strong>Diagnosis: </strong>{record.diagnosis.join(', ')}</p>
                                              <p style={{ fontStyle: 'italic', color: '#808080' }}>Dr. John, Columbia Asia Hospital Setapak</p>
                                            </div>
                                            <div>
                                              <p>{record.consultation_date}</p>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p>No Past Medical Record Available</p>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Section */}
                            {/* TODO */}
                            {/* <div className="mb-6">
                              <h3 className="text-lg font-semibold">Details</h3>
                              {!seeDetails && (<div style={{ maxHeight: '330px', overflowY: 'auto' }} className="p-4 bg-gray-100 rounded-md">
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
                              )}

                              {seeDetails && (<div style={{ maxHeight: '330px', overflowY: 'auto' }} className="p-4 bg-gray-100 rounded-md">
                                <strong>Attended Doctor:</strong>
                                <p>Dr. John Lee</p><br></br>
                                <strong>Practice Address:</strong>
                                <p>Columbia Asia Hospital Setapak</p><br></br>
                                <strong>Date & Time:</strong>
                                <p>09/07/2024, 11.26 am</p><br></br>
                                <strong>Diagnosis:</strong>
                                <p>Stroke</p><br></br>
                                <strong>Diagnosis Details:</strong>
                                <p>Diagnosed with stroke, immediate treatment required to restore blood flow to the brain and minimize potential damage, followed by rehabilitation and long-term management</p><br></br>
                                <strong>Medications Prescribed:</strong>
                                <p>Antiplatelet Agent:

                                  Aspirin 81 mg orally once daily.
                                  Clopidogrel (Plavix) 75 mg orally once daily if the patient is allergic to aspirin.
                                  Anticoagulant (if indicated):

                                  Warfarin (Coumadin) 5 mg orally once daily, adjusted based on INR levels.
                                  Dabigatran (Pradaxa) 150 mg orally twice daily (alternative to warfarin).
                                  Antihypertensive (if needed):

                                  Lisinopril 10 mg orally once daily to control blood pressure.
                                  Amlodipine 5 mg orally once daily.
                                  Statin:

                                  Atorvastatin (Lipitor) 40 mg orally once daily at bedtime to manage cholesterol levels.
                                  Neuroprotective Agent (optional and under doctor's discretion):

                                  Citicoline 500 mg orally twice daily.
                                  Thrombolytic Therapy (for acute ischemic stroke, administered in hospital settings):

                                  Alteplase (tPA) 0.9 mg/kg IV (10% as a bolus, the remainder over 60 minutes), administered within 4.5 hours of symptom onset.
                                </p>
                              </div>)}
                            </div> */}
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
                  )}
                  <label className="block mb-2" htmlFor="diagnosis"><strong>Diagnosis:</strong></label>
                  <select id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="p-2 border rounded-md w-full mb-4">
                    <option>-- Please Select --</option>
                    <Option />
                  </select>

                  <label className="block mb-2" htmlFor="details"><strong>Diagnosis Details:</strong></label>
                  <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="p-2 border rounded-md w-full mb-4" placeholder="Enter details to be added"></textarea>

                  <label className="block mb-2" htmlFor="prescription"><strong>Medification Prescription:</strong></label>
                  <textarea id="prescription" value={prescription} onChange={(e) => setPrescription(e.target.value)} className="p-2 border rounded-md w-full mb-4" placeholder="Enter medification Prescription"></textarea>

                  <button onClick={handleNewMedicalRecord} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Record new Medical Record
                  </button>
                </div>
              )}
            </Dialog>
          </div>
        </div>
      </div>
    </main>
  );
}
