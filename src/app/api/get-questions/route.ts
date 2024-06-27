import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "../../../../db";




export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user
        if(!session || !user){
            return Response.json({
                message : "user not authorized",
                success : false
            },{
                status : 403
            })
        }
        const questions = await prisma.question.findMany({
            where : {
                userId : user.id
            }
        })

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