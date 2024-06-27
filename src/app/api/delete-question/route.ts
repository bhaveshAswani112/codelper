import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { NextRequest } from "next/server"
import prisma from "../../../../db"

export async function DELETE(req : NextRequest , {params} : {params : any}) {
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
        const {searchParams} = new URL(req.url);
        const questionId = Number(searchParams.get("questionId"));
        // console.log(param)
        await prisma.question.delete({
            where : {
                id : questionId
            }
        })
            return Response.json({
                message : "question deleted successfully",
                success : true
            },{
                status : 200
            })

    } catch (error) {
        console.error(error)
    }
}