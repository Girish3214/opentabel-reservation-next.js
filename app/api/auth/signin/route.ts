import { NextResponse } from "next/server";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from 'jose'

const prisma = new PrismaClient()
export async function POST(request: Request) {
    const { email, password } = await request.json();

    const errors: string[] = []
    const validationSchema = [

        {
            valid: validator.isEmail(email),
            errorMessage: "Email is invalid"
        },

        {
            valid: validator.isLength(password, {
                min: 1
            }),
            errorMessage: "password is invalid"
        },
    ];


    validationSchema.forEach((check) => {
        if (!check.valid) {
            errors.push(check.errorMessage)
        }
    })

    if (errors.length) {
        return NextResponse.json({ errorMessage: errors[0] })
    }
    const userWithEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!userWithEmail) {
        return NextResponse.json({ errorMessage: "Email or password is invalid" })
    }

    const isMatch = bcrypt.compare(password, userWithEmail.password);

    if (!isMatch) {
        return NextResponse.json({ errorMessage: "Email or password is invalid" })
    }

    const alg = "HS256"
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new jose.SignJWT({ email: userWithEmail.email }).setProtectedHeader({ alg }).setExpirationTime("24h").sign(secret)

    return NextResponse.json({ token });

}