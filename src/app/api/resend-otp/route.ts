import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { NextRequest } from "next/server"
import prisma from "../../../../db"
import { resendOTP } from "@/utils/OTPhelper"
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';


// Create a new rateLimit instance
const rateLimit = new Ratelimit({
	redis: kv, // Use Vercel KV for storage
	limiter: Ratelimit.slidingWindow(1, '3m'), 
});

export async function POST(req : NextRequest , {params} : {params : any}) {
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