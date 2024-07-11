import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/db/index";

export const dynamic = 'force-dynamic';


export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user
        if(!session || !user || !user.isVerified){
            return Response.json({
                message : "user not authorized",
                success : false
            },{
                status : 403
            })
        }
        // console.log(session.user)
        const questions = await prisma.question.findMany({
            where : {
                userId : user.id
            }
        })
        // console.log(questions)
        return Response.json({
            message : "All questions fetched successfully",
            success : true,
            questions : questions
        },{
            status : 200
        })

    } catch (error) {
        console.error(error)
        return Response.json({
            message : "Error in getting questions",
            success : false
        },{
            status : 500
        })
    }
}