import 'next-auth'
import { DefaultSession } from 'next-auth'
import { Question , User } from '@prisma/client'


declare module 'next-auth' {
    interface User {
        id? : User.id
        username? : User.username
        email? : User.email
    }
    interface Session {
        user : {
            id? : User.id
            username? : User.username
            email? : User.email
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id? : User.id
        username? : User.username
        email? : User.email
    }
}