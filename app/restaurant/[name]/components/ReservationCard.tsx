"use client";
import DatePicker from "react-datepicker";
import { partySize as partySizesArray, times } from "../../../../data";
import { useMemo, useState } from "react";
import useAvailability from "@/hooks/useAvailability";
import Link from "next/link";
import { convertToDisplayTime } from "@/app/utils/convertToDisplayTime";

function ReservationCard({
  openTime,
  closeTime,
  name,
}: {
  openTime: string;
  closeTime: string;
  name: string;
}) {
  const { loading, data, error, fetchAvailabilities } = useAvailability();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState(2);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const day = date.toISOString().split("T")[0];
      setDay(day);
      setSelectedDate(date);
      return;
    }
    setSelectedDate(null);
  };
  const handleFindTime = async () => {
    fetchAvailabilities({ name, day, partySize, time });
  };

  const renderTimeByTimings = useMemo(() => {
    const timeSlots: typeof times = [];
    let isWithInWindow: boolean = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithInWindow = true;
      }
      if (isWithInWindow) {
        timeSlots.push(time);
      }
      if (time.time === closeTime) {
        isWithInWindow = false;
      }
    });
    return timeSlots;
  }, []);
  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          value={partySize}
          onChange={(e) => setPartySize(+e.target.value)}
          className="py-3 border-b font-light"
          id=""
        >
          {partySizesArray.map((size) => (
            <option value={size.value} key={size.label + size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            onChange={(date) => handleDateChange(date)}
            selected={selectedDate}
            className="py-3 border-b font-light text-reg w-28 "
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="py-3 border-b font-light"
          >
            {renderTimeByTimings.map((time) => (
              <option key={time.time + time.displayTime} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={() => handleFindTime()}
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          disabled={loading}
        >
          {loading ? "loading..." : "Find a Time"}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) =>
              time.available ? (
                <Link
                  key={time.available + time.time}
                  href={`/reserve/${name}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time)}
                  </p>
                </Link>
              ) : (
                <p
                  key={time.available + time.time}
                  className="bg-gray-200 p-2 w-24 mb-3 rounded mr-3"
                ></p>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ReservationCard;
