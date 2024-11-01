import { NextAuthOptions, SessionStrategy, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/db/index";



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
                        },
                        include: {
                            questions: true 
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
                } catch (error : any) {
                    throw new Error(error?.message || "Sign In failed")
                }
            },
            
        }),
    ],
    jwt : {
        maxAge : 1*24*60*60
    },
    useSecureCookies : true,
    callbacks : {
        async jwt({ token , user}) {
            if(user){
                token.id = user.id
                token.username = user.username
                token.email = user.email
                token.isVerified = user.isVerified
                token.questions = user.questions
            }
            return token
        },

        async session({session , token}) {
            if(token){
                session.user.id = token.id
                session.user.username = token.username
                session.user.email = token.email
                session.user.isVerified = token.isVerified
                session.user.questions = token.questions
            }
            return session
        },
    },
    
    session : {
        strategy : "jwt" as SessionStrategy,
        maxAge : 1*24*60*60,
    },
    pages :  {
        signIn : "/sign-in"
    },
    secret : process.env.NEXT_AUTH_SECRET,
    
}