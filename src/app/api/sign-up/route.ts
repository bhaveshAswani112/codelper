import { NextRequest } from "next/server";
import prisma from "@/db/index";
import bcrypt from "bcryptjs"
import {  sendOTP } from "@/utils/OTPhelper";

export async function POST(req : NextRequest) {
    try {
        const {username , email , password} = await req.json()
        // console.log(username,email,password)
        let existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })
        // console.log("I am existing")
        // console.log(existingUser)
        if(existingUser && existingUser.isVerified){
            return Response.json({
                message : "User already exist",
                success : false
            },{
                status : 400
            })
        }
        // console.log("Not verified existing user")
        const hashedPassword = await bcrypt.hash(password,10)
        if(existingUser) {
            existingUser = await prisma.user.update({
                where : {
                    id : existingUser?.id
                },
                data : {
                    password : hashedPassword,
                    username
                }
            })
        }

        else{
            const newUser = await prisma.user.create({
                data : {
                    username,
                    email,
                    password : hashedPassword
                }
            })
        }
        
        const response : {orderId : string} = await sendOTP(email)
        console.log(response)
        return Response.json({
            message : "User created successfully",
            success : true,
            orderId : response.orderId
        },{
            status : 200
        })

    } catch (error) {
        return Response.json({
            message : "User Sign-Up failed",
            success : false
        },{
            status : 500
        })
    }
}