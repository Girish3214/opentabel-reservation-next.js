import { NextResponse } from "next/server";

import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { headers } from "next/headers";


const prisma = new PrismaClient();
export async function GET(request: Request) {
    const headersList = headers();
    const bearerToken = headersList.get("authorization") as string
    const token = bearerToken?.split(" ")[1]

    const payload = jwt.decode(token) as { email: string }

    if (!payload.email) {
        return NextResponse.json({ errorMessage: "Unauthorized request" })

    }
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
            phone: true,
        }
    })
    return NextResponse.json({ user })

}