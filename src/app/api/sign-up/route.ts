import { NextRequest } from "next/server";
import prisma from "../../../../db";
import bcrypt from "bcryptjs"

export async function POST(req : NextRequest) {
    try {
        const {username , email , password} = await req.json()
        console.log(username,email,password)
        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(existingUser){
            return Response.json({
                message : "User already exist",
                success : false
            },{
                status : 400
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data : {
                username,
                email,
                password : hashedPassword
            }
        })
        return Response.json({
            message : "User created successfully",
            success : true
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