"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";


// signup
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params

    try {
        // try to frectj the data fromt he users sectoions and get the uid and then fetch it
        const userRecord = await db.collection("users").doc(uid).get()

        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Please sign in instead."
            }
        }

        // created new user
        await db.collection("users").doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created Successfully! Please Sign In"
        }

    } catch (error: any) {
        console.error("Error creating the user!", error)

        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email already in use!"
            }
        }

        return {
            success: false,
            message: "Failed to create an account!"
        }
    }
}

// signin
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {

        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User does not exist. Create an account instead"
            }
        }


        // so this create sa new cookie then logs in
        await setSessionCookie(idToken)

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Failed to log into an account!"
        }
    }

}

// making the session cookie same as jwt in mern stack
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies()

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000, // 1week
    })

    cookieStore.set("session", sessionCookie, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",  //took it from docs
    })
}


// this is to protect the route
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies()

    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

        const userRecord = await db.collection("users").doc(decodedClaims.uid).get()

        if (!userRecord.exists) {
            return null
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User

    } catch (error) {
        console.error(error);

        return null
    }
}

export async function isAuthenticated() {

    const user = await getCurrentUser()

    return !!user;  //this !! cnverts to a boolena value

}