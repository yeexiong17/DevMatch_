"use server"

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15 minutes")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });

        return payload;
    } catch (error) {
        if (error.name === 'JWTExpired') {
            // Handle expired token
            console.error('Token expired:', error.message);

            throw new Error('Your session has expired. Please log in again.');
        } else if (error.name === 'JsonWebTokenError') {
            // Handle other JWT errors
            console.error('Invalid token:', error.message);

            throw new Error('Invalid token. Please try again.');
        } else {
            // Handle unexpected errors
            console.error('Error during token verification:', error);

            throw new Error('An error occurred during token verification.');
        }
    }
}

export async function login(data) {
    const user = { walletAddress: data.walletAddress, name: data.name };

    // Create the session
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("walletAddress", user.walletAddress);
    cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
    // Destroy the cookies
    cookies().set("walletAddress", "", { expires: new Date(0) });
    cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return redirect('/patientSignup');
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}