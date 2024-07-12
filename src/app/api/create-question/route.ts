import { getServerSession } from "next-auth";
import prisma from "@/db/index";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import {CreateQuestion} from "@/Schema/CreateQuestion";


export const dynamic = 'force-dynamic';

export async function  POST(req : NextRequest){
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user
        // console.log(user)
        // console.log(user)
        if(!session || !user || !user.isVerified){
            return Response.json({
                message : "User is not authorized",
                success : false
            },{
                status : 403
            })
        }
        const {title, link, difficulty, isDone} : CreateQuestion = await req.json()
        const existingQuestion = await prisma.question.findFirst({
            where : {
                userId : user?.id,
                OR : [
                    {title},
                    {link}
                ]
            }
        })
        if(existingQuestion){
            return Response.json({
                message : "A question already exist with this title or link",
                success : false
            },{
                status : 400
            })
        }
        const question = await prisma.question.create({
            data : {
                title,
                link,
                difficulty,
                isDone : isDone,
                userId : user?.id
            }
        })
        session.user.questions.push(question);
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