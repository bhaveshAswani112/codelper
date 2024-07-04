import { getServerSession } from "next-auth";
import prisma from "../../../../db";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import CreateQuestion from "@/Schema/CreateQuestion";



export async function  POST(req : NextRequest){
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user
        // console.log(user)
        if(!session || !user){
            return Response.json({
                message : "User is not authorized",
                success : false
            },{
                status : 403
            })
        }
        const { link, difficulty, note , isDone} : CreateQuestion = await req.json()
        const question = await prisma.question.create({
            data : {
                link,
                difficulty,
                note,
                isDone,
                userId : user?.id
            }
        })
        return Response.json({
            message : "Question created successfully.",
            success : true
        },{
            status : 200
        })
    } catch (error) {
        console.error(error)
        return Response.json({
            message : "Error during question creation",
            success : false
        },{
            status : 500
        })
    }
    
}