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

    const bookings = await prisma.booking.findMany({
        where: {
            booking_time: {
                gte: new Date(`${day}T${searchTimes[0]}`),
                lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`)
            }
        },
        select: {
            number_of_people: true,
            booking_time: true,
            tables: true,
        }
    })

    const bookingTableObj: { [key: string]: { [key: number]: true } } = {}

    bookings.forEach(booking => {
        bookingTableObj[booking.booking_time.toISOString()] = booking.tables.reduce((obj, table) => {
            return {
                ...obj,
                [table.table_id]: true
            }
        }, {})
    })

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

    const tables = restaurant.tables;

    const searchTimesWIthTables = searchTimes.map(searchTime => {
        return {
            date: new Date(`${day}T${searchTime}`),
            time: searchTime,
            tables
        }
    });

    searchTimesWIthTables.forEach((t) => t.tables = t.tables.filter(table => {
        if (bookingTableObj[t.date.toISOString()]) {
            if (bookingTableObj[t.date.toISOString()][table.id]) {
                return false
            }
            return true;
        }
    }))

    const availabilities = searchTimesWIthTables.map(t => {
        const sumSeats = t.tables.reduce((sum, table) => {
            return sum + table.seats
        }, 0)
        return {
            time: t.time,
            availabile: sumSeats >= parseInt(partySize)
        }
    }).filter(availability => {
        const timeAfterOpening = new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`)
        const timeBeforeClosing = new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`)
        return timeAfterOpening && timeBeforeClosing
    })
    return NextResponse.json(availabilities)
}