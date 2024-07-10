import { verifyOTP } from "@/utils/OTPhelper";
import { NextRequest } from "next/server";
import prisma from "../../../../db";





export async function POST(req : NextRequest) {
    try {
        const {email,orderId,code} = await req.json()
        // console.log("I am Email ")
        // console.log(email)
        const user = await prisma.user.findFirst({
            where : {
                email
            }
        })
        if(!user){
            return Response.json({
                message : "No user exist with this username",
                success : false
            },{
                status : 403
            })
        }
        if(user.isVerified){
            return Response.json({
                message : "User already verified",
                success : false
            },{
                status : 400
            })
        }
        const verify = await verifyOTP(email,code,orderId)
        if(!verify?.isOTPVerified){
            return Response.json({
                message : verify.reason,
                success : true
            },{
                status : 400
            })
        }
        await prisma.user.update({
            where : {
                email : email
            },
            data : {
                isVerified : true
            }
        })
        return Response.json({
            message : "User verified successfully",
            success : true
        },{
            status : 200
        })
    } catch (error : any) {
        return Response.json({
            message : error.message || "Error from backend",
            success : false
        },{
            status : 500
        })
    }
}