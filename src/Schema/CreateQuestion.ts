import { difficulty } from "@prisma/client"


export interface CreateQuestion {
    title : string
    link : string,
    difficulty : difficulty
    isDone? : boolean
}

