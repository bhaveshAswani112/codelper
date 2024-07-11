import { verifyOTP } from "@/utils/OTPhelper";
import { NextRequest } from "next/server";
import prisma from "../../../../db";




import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';


// Create a new rateLimit instance
const rateLimit = new Ratelimit({
	redis: kv, // Use Vercel KV for storage
	limiter: Ratelimit.slidingWindow(5, '1m'), 
});





export async function POST(req : NextRequest) {
    try {

        const ip : any = req.headers.get('x-forwarded-for');

        // Check if the user has reached their rate limit
        const { success } = await rateLimit.limit(`ratelimit_${ip}`);

        if (!success) {
            return Response.json(
                {
                    message: 'Too many requests, please try again later.',
                },
                {
                    status: 429,
                }
            );
        }

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