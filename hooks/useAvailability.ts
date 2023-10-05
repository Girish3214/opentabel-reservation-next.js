import axios from "axios";
import { useState } from "react";

export default function useAvailability() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState<{ time: string, available: boolean }[] | null>(null);

    const fetchAvailabilities = async ({
        name,
        partySize,
        day,
        time,
    }: {
        name: string;
        partySize: number;
        day: string;
        time: string;
    }) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/restaurant/${name}/availability`,
                {
                    params: {
                        day, partySize, time
                    }
                }
            );
            setLoading(false);
            setData(response.data);
        } catch (error: any) {
            setLoading(false);
            setError(error.response.data.errorMessage);
        }
    };
    return { loading, data, error, fetchAvailabilities }
}
