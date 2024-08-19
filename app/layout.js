"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import Header from "./components/Header";
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import { getSession } from "../lib";

import { Toast } from 'primereact/toast';


const MyContext = createContext();

const inter = Inter({ subsets: ["latin"] });

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContext.Provider');
  }
  return context;
};

export default function RootLayout({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState("")

  const toast = useRef(null)

  useEffect(() => {
    fetchSession();
  }, [])

  const fetchSession = async () => {
    try {
      const session = await getSession();

      setLoggedInUser(session.user)
      logIn()
      console.log(session.user);

    } catch (error) {
      setIsLoggedIn(false)
      toast.current.show({ severity: 'error', summary: `Authentication Error`, detail: `Please Login Again, ${error}` });
      console.error('Failed to get session:', error);
    }
  }

  const logIn = () => {
    setIsLoggedIn(true)
  }

  const logOut = () => {
    setLoggedInUser("")
    setIsLoggedIn(false)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <MyContext.Provider value={{ logIn, logOut, isLoggedIn, loggedInUser, fetchSession }}>
          <Header />
          <Toast ref={toast} />
          {children}
        </MyContext.Provider>
      </body>
    </html>
  );
}
