import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from '@prisma/client'
import { times } from '../../../../../data'


const prisma = new PrismaClient();
export async function GET(request: NextRequest, { params }: any) {

    const searchParams = request.nextUrl.searchParams

    const name = params.name
    const day = searchParams.get("day");
    const time = searchParams.get("time");
    const partySize = searchParams.get("partySize");

    if (!day || !time || !partySize) {
        return NextResponse.json({
            errorMessage:
                "Invalid data provided"
        }, { status: 400 })
    }

    const searchTimes = times.find(t => t.time === time)?.searchTimes;

    if (!searchTimes) {
        return NextResponse.json({
            errorMessage:
                "Invalid data provided"
        }, { status: 400 })
    }

    return NextResponse.json({ searchTimes })
}