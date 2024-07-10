import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { NextRequest } from "next/server"
import prisma from "../../../../db"
import { resendOTP } from "@/utils/OTPhelper"

export async function POST(req : NextRequest , {params} : {params : any}) {
    try {
        const {orderId} = await req.json()
        const [status,result] = await resendOTP(orderId)
        if(status==200 || status==400){
            return Response.json({
                message : result.message || "OTP sent successfully",
                success : status==200
            },{
                status : status
            })
        }
        
            return Response.json({
                message : "question deleted successfully",
                success : true
            },{
                status : 200
            })

    } catch (error) {
        console.log(error)
        return Response.json({
            message : "Error in resend OTP",
            success : false
        },{
            status : 500
        })
    }
}