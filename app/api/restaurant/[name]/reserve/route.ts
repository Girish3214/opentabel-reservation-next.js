import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from '@prisma/client'
import { findAvailableTables } from "@/services/restaurant/findAvailableTabls";


const prisma = new PrismaClient();
export async function POST(request: NextRequest, { params }: any) {

    const { booker_email, booker_phone, booker_first_name, booker_last_name, booker_occasion, booker_request } = await request.json();

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
            close_time: true,
            id: true
        }
    })

    if (!restaurant) {
        return NextResponse.json({
            errorMessage:
                "Restaurant not found"
        }, { status: 400 })
    }


    if (new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
        new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
        return NextResponse.json({
            errorMessage:
                "Restaurant is on open at this time"
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
        const searchTimeWithTables = searchTimesWIthTables.find(t => t.date.toISOString() === new Date(`${day}T${time}`).toISOString())
        if (!searchTimeWithTables) {
            return NextResponse.json({
                errorMessage:
                    "No Availability, cannot book"
            }, { status: 400 })
        }

        const tablesCount: {
            2: number[];
            4: number[];
        } = {
            2: [],
            4: []
        }

        searchTimeWithTables.tables.forEach(table => {
            if (table.seats === 2) {
                tablesCount[2].push(table.id)
            } else {
                tablesCount[4].push(table.id)
            }
        })
        const tablesToBook: number[] = [];
        let seatsRemaining = parseInt(partySize);


        while (seatsRemaining > 0) {
            if (seatsRemaining >= 3) {
                if (tablesCount[4].length) {
                    tablesToBook.push(tablesCount[4][0]);
                    tablesCount[4].shift();
                    seatsRemaining = seatsRemaining - 4;
                } else {
                    tablesToBook.push(tablesCount[2][0]);
                    tablesCount[2].shift();
                    seatsRemaining = seatsRemaining - 2;
                }
            } else {
                if (tablesCount[2].length) {
                    tablesToBook.push(tablesCount[2][0]);
                    tablesCount[2].shift();
                    seatsRemaining = seatsRemaining - 2;
                } else {
                    tablesToBook.push(tablesCount[4][0]);
                    tablesCount[4].shift();
                    seatsRemaining = seatsRemaining - 4;
                }

            }
        }

        const booking = await prisma.booking.create({
            data: {
                number_of_people: parseInt(partySize),
                booking_time: new Date(`${day}T${time}`),
                booker_email,
                booker_first_name,
                booker_last_name,
                booker_occasion,
                booker_phone,
                booker_request,
                restaurant_id: restaurant.id
            }
        })

        const bookimgsOnTableData = tablesToBook.map((tableId) => {
            return { table_id: tableId, booking_id: booking.id }
        })
        await prisma.bookingsOnTable.createMany({
            data: bookimgsOnTableData
        })
        return NextResponse.json({ booking })
    }

}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=01:30:00.000Z&partySize=6