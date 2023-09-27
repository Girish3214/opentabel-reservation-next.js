import { NextResponse } from "next/server";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from 'jose'

const prisma = new PrismaClient()
export async function POST(request: Request) {
  const { firstName, lastName, email, phone, city, password } = await request.json();
  const userWithEmail = await prisma.user.findFirst({
    where: {
      email
    }
  })

  if (userWithEmail) {
    return NextResponse.json({ errorMessage: "Email is associated with another account!" })
  }
  const errors: string[] = []
  const validationSchema = [
    {
      valid: validator.isLength(firstName, {
        min: 1,
        max: 35
      }),
      errorMessage: "First name is invalid"
    },
    {
      valid: validator.isLength(lastName, {
        min: 1,
        max: 35
      }),
      errorMessage: "Last name is invalid"
    },
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid"
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: "Phone number is invalid"
    },
    {
      valid: validator.isLength(city, {
        min: 1
      }),
      errorMessage: "City is invalid"
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: "password is not Strong"
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

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      first_name: firstName, last_name: lastName, email, phone,
      city, password: hashedPassword
    }
  });

  const alg = "HS256"
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new jose.SignJWT({ email: user.email }).setProtectedHeader({ alg }).setExpirationTime("24h").sign(secret)

  return NextResponse.json({ token });
}
