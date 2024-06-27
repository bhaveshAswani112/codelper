import { difficulty } from "@prisma/client"

export default interface CreateQuestion {
    link : string,
    difficulty : difficulty
    note? : string
    isDone? : boolean
}

