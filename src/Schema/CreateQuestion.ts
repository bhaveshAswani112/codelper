import { difficulty } from "@prisma/client"


export default interface CreateQuestion {
    title : string
    link : string,
    difficulty : difficulty
    isDone? : boolean
}

