"use client";
import { useState, useEffect } from "react"
import SubNav from '../components/SubNav/SubNav'

import { query, collection, db, getDocs, getDoc, updateDoc, arrayUnion, doc } from '../../firebase.config'

import { useMyContext } from '../layout'

export default function Home() {

  const { logIn, logOut, isLoggedIn, loggedInUser, fetchSession } = useMyContext()

  const [doctorList, setDoctorList] = useState([])
  const [doctorOption, setDoctorOption] = useState(null)
  const [isAccessAllowed, setIsAccessAllowed] = useState(false)
  const [accessDoctor, setAccessDoctor] = useState([])
  const [currentPatientRecord, setCurrentPatientRecord] = useState([])
  const [selectedRecordDetails, setSelectedRecordDetails] = useState(null)

  useEffect(() => {
    triggerGetPatientRecord()
    getAccessDoctor()
  }, [])

  useEffect(() => {
    getAllDoctors()
    console.log(accessDoctor)
  }, [accessDoctor])

  useEffect(() => {
    console.log("Doctor Access Selection:", accessDoctor)
  }, [accessDoctor])

  const triggerGetPatientRecord = async () => {
    setCurrentPatientRecord(await getPatientRecord(loggedInUser.walletAddress))
  }

  async function getAllDoctors() {
    const q = query(collection(db, "doctors"));

    let doctorList = []

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      doctorList.push(doc.data())
    })
    setDoctorList(doctorList.filter(doctor => !accessDoctor.some(accessDoctor => accessDoctor.walletAddress === doctor.walletAddress)))
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

  const onSelectRecord = (index) => {
    setSelectedRecordDetails(currentPatientRecord[index])
  }

  // Get All Doctors That Have Access
  const getAccessDoctor = async () => {
    const q = doc(db, "patients", loggedInUser.email)

    const docSnapshot = await getDoc(q)

    if (docSnapshot.exists()) {
      let patientData = docSnapshot.data()
      setAccessDoctor(patientData.doctorAccess)
    }
    else {
      alert('User Not Found!')
    }
  }

  const handleRemoveAccess = async (doctorToRemove) => {
    const removedDoctorArray = accessDoctor.filter((doctor) => doctor.walletAddress != doctorToRemove.walletAddress)

    const patientRef = doc(db, "patients", loggedInUser.email);

    await updateDoc(patientRef, {
      doctorAccess: removedDoctorArray
    })

    alert(`Dr ${doctorToRemove.name} access has been removed! `)

    getAccessDoctor()
  }

  const handleDoctorSelection = (e) => {
    const selectedDoctor = JSON.parse(e.target.value)
    setDoctorOption(selectedDoctor)
    console.log(selectedDoctor)
  }

  const handleAllowAccess = async () => {
    if (!doctorOption) {
      return alert('Doctor is not chosen yet')
    }

    const patientRef = doc(db, "patients", loggedInUser.email)

    await updateDoc(patientRef, {
      doctorAccess: arrayUnion(doctorOption)
    })

    document.querySelector('#doctorSelect').value = ""
    setDoctorOption(null)
    getAccessDoctor()
    alert(`Doctor: ${doctorOption.walletAddress} has been granted access`)
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
                    <div className="p-4 bg-gray-100 rounded-md mb-4">
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>

                        {
                          currentPatientRecord.length > 0 ? (
                            currentPatientRecord.map((record, index) => (
                              <div
                                key={index}
                                onClick={() => onSelectRecord(index)}
                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                className="p-4 bg-gray-100 rounded-md mb-4 border-b border-gray-300 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300"
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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div style={{ maxHeight: '330px', overflowY: 'auto' }} className="p-4 bg-gray-100 rounded-md h-full">

                    {
                      selectedRecordDetails
                        ? (
                          <>
                            <strong>Attended Doctor:</strong>
                            <p>Dr. John Lee</p><br></br>
                            <strong>Practice Address:</strong>
                            <p>Columbia Asia Hospital Setapak</p><br></br>
                            <strong>Date & Time:</strong>
                            <p>{selectedRecordDetails.consultation_date}</p><br></br>
                            <strong>Diagnosis:</strong>
                            <p>{selectedRecordDetails.diagnosis.join(', ')}</p><br></br>

                            <strong>Diagnosis Details:</strong>
                            <p>{selectedRecordDetails.details}</p><br></br>
                            <strong>Medications Prescribed:</strong>
                            <p>{selectedRecordDetails.prescription}</p>
                          </>
                        )
                        : (
                          <p>No Record Found</p>
                        )
                    }
                    {/* <strong>Attended Doctor:</strong>
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
                    </p> */}
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
            <label htmlFor="doctorSelect" className="block mb-2"><strong>Doctor:</strong></label>
            <select onChange={handleDoctorSelection} id="doctorSelect" className="p-2 border rounded-md w-full">
              <option value={""}>--Select An Option--</option>
              {
                doctorList.map((doctor) => (
                  <option key={doctor.walletAddress} value={JSON.stringify(doctor)}>
                    Dr {doctor.name}
                  </option>
                ))
              }
            </select>

            <button
              onClick={handleAllowAccess}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={!doctorOption}
            >
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
              <tbody>
                {accessDoctor && accessDoctor.length > 0 ? (
                  accessDoctor.map((doctor, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">Dr {doctor.name}</td>
                      <td className="py-2 px-4 border-b">{doctor.walletAddress}</td>
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => handleRemoveAccess(doctor)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                          Remove access
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 border-b text-center">No doctor available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
