import { NextResponse } from "next/server";
import validator from "validator";


export async function POST(request: Request) {
  const { firstName, lastName, email, phone, city, password } = await request.json();

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

  return NextResponse.json({ hello: "entered.." });
}
