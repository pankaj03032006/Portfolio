import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectDB } from "./db";
import User from "../models/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Please enter username and password");
                }

                try {
                    await ConnectDB();
                    const user = await User.findOne({ username: credentials.username });

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    // Compare hashed password
                    const isPasswordValid = await user.comparePassword(credentials.password);
                    
                    if (!isPasswordValid) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user._id.toString(),
                        username: user.username
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null; // Return null instead of throwing for better UX
                }
            }
        })
    ],
    
    // ... rest of your config remains the same
};