import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../../../db";



export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                email : {type : "email" , label : "Email" , placeholder : "Enter your email id"},
                password : {label : "Password" , type:"password",placeholder:"Enter your password"}
            },
            async authorize(credentials) : Promise<any> {
                try {
                    const existing = await prisma.user.findUnique({
                        where : {
                            email : credentials?.email
                        }
                    })
                    if(!existing || !existing.isVerified){
                        throw new Error("User does not exist")
                    }
                    const check = await bcrypt.compare(credentials?.password || "",existing.password)
                    if(!check){
                        throw new Error("Incorrect password")
                    }
                    return existing
                } catch (error) {
                    // console.error(error)
                    // @ts-ignore
                    throw new Error(error?.message || "Sign In failed")
                }
            },
        })
    ],
    callbacks : {
        async jwt({ token , user}) {
            if(user){
                token.id = user.id
                token.username = user.username
                token.email = user.email
                token.isVerified = user.isVerified
            }
            return token
        },

        async session({session , token}) {
            if(token){
                session.user.id = token.id
                session.user.username = token.username
                session.user.email = token.email
                session.user.isVerified = token.isVerified
            }
            return session
        },
    },
    
    session : {
        strategy : "jwt",
    },
    pages :  {
        signIn : "/sign-in"
    },
    secret : process.env.NEXT_AUTH_SECRET,
}