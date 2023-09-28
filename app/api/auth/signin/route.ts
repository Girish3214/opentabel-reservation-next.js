import { NextResponse } from "next/server";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from 'jose'

import { cookies } from 'next/headers'

const prisma = new PrismaClient()
export async function POST(request: Request, response: Response) {
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
        return NextResponse.json({ errorMessage: errors[0] }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        return NextResponse.json({ errorMessage: "Email or password is invalid" }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return NextResponse.json({ errorMessage: "Email or password is invalid" }, { status: 401 })
    }

    const alg = "HS256"
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new jose.SignJWT({ email: user.email }).setProtectedHeader({ alg }).setExpirationTime("24h").sign(secret)

    const oneDay = 24 * 60 * 60 * 1000
    cookies().set('jwt', token, { maxAge: oneDay })

    return NextResponse.json({
        firstName: user.first_name,
        lastName: user.last_name,
        city: user.city,
        email: user.email,
        phone: user.phone,
        id: user.id,
    });

}