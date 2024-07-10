import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { NextRequest } from "next/server"
import prisma from "../../../../../db"
import { useParams } from "next/navigation"


export async function PUT(req:NextRequest,param:any) {
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
            const questionId = Number(param.params.id[0])
            const {isDone} = await req.json()
            await prisma.question.update({
                where : {
                    id : questionId
                },
                data : {
                    isDone
                }
            })
            return Response.json({
                message : "question edited successfully",
                success : true
            },{
                status : 200
            })

    } catch (error) {
        console.error(error)
        return Response.json({
            message : "Error during updating question.",
            success : false
        },{
            status : 500
        })
    }
}