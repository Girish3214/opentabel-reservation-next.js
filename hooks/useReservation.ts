import axios from "axios";
import { useState } from "react";

export default function useReservation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createReservation = async ({
        name,
        partySize,
        day,
        time,
        booker_first_name,
        booker_last_name,
        booker_phone,
        booker_email,
        booker_occasion,
        booker_request,
    }: {
        name: string;
        partySize: number;
        day: string;
        time: string;
        booker_first_name: string,
        booker_last_name: string,
        booker_phone: string,
        booker_email: string,
        booker_occasion: string,
        booker_request: string,
    }) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:3000/api/restaurant/${name}/reserve`,
                {
                    booker_first_name,
                    booker_last_name,
                    booker_phone,
                    booker_email,
                    booker_occasion,
                    booker_request,
                }, {
                params: {
                    day, partySize, time
                }
            }
            );
            setLoading(false);
            return response.data
        } catch (error: any) {
            setLoading(false);
            setError(error.response.data.errorMessage);
        }
    };
    return { loading, error, createReservation }
}
