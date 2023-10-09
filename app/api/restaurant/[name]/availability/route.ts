import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from '@prisma/client'
import { findAvailableTables } from "@/services/restaurant/findAvailableTabls";


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

    const restaurant = await prisma.restaurant.findUnique({
        where: {
            slug: name
        },
        select: {
            tables: true,
            open_time: true,
            close_time: true
        }
    })

    if (!restaurant) {
        return NextResponse.json({
            errorMessage:
                "Invalid data provided"
        }, { status: 400 })
    }

    const searchTimesWIthTables = await findAvailableTables({
        day, time, restaurant
    })

    if (!searchTimesWIthTables) {
        return NextResponse.json({
            errorMessage:
                "Invalid data provided"
        }, { status: 400 })
    }
    if (Array.isArray(searchTimesWIthTables)) {
        const availabilities = searchTimesWIthTables.map(t => {
            const sumSeats = t.tables.reduce((sum, table) => {
                return sum + table.seats
            }, 0)
            return {
                time: t.time,
                available: sumSeats >= parseInt(partySize)
            }
        }).filter(availability => {
            const timeAfterOpening = new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`)
            const timeBeforeClosing = new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`)
            return timeAfterOpening && timeBeforeClosing
        })
        return NextResponse.json(availabilities)
    }
}