import { times } from "@/data";
import { NextResponse } from "next/server";

import { PrismaClient, Table } from '@prisma/client'

const prisma = new PrismaClient();
export const findAvailableTables = async ({
    time, day, restaurant
}: {
    time: string;
    day: string;
    restaurant: {
        tables: Table[];
        open_time: string;
        close_time: string;
    }
}) => {
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


    let tables = restaurant.tables;

    let searchTimesWIthTables = searchTimes.map(searchTim => ({
        date: new Date(`${day}T${searchTim}`),
        time: searchTim,
        tables
    }))

    searchTimesWIthTables.forEach((tb) => tb.tables = tables)


    searchTimesWIthTables.forEach((t) => {
        t.tables = t.tables.filter(table => {
            if (bookingTableObj[t.date.toISOString()]) {
                if (bookingTableObj[t.date.toISOString()][table.id]) return false;
            }
            return true;
        })
    })

    return searchTimesWIthTables;
}