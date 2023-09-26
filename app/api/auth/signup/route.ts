import { NextResponse } from "next/server";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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

  return NextResponse.json({ hello: user });
}
