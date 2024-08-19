"use server"

import { redirect } from 'next/navigation'

import { login, logout } from "../../../lib"

const createUser = async (data) => {
    await login(data)
    redirect("/patient")
}

const createDoc = async (data) => {
    await login(data)
    redirect("/doctor")
}

const handleServerLogOut = async () => {
    await logout()
    redirect("/patientSignup")
}


export {
    createUser,
    createDoc,
    handleServerLogOut
}