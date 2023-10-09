"use client";
import useReservation from "@/hooks/useReservation";
import React, { useEffect, useState } from "react";

function Form({
  name,
  partySize,
  date,
}: {
  name: string;

  partySize: string;
  date: string;
}) {
  const { error, loading, createReservation } = useReservation();
  const [day, time] = date.split("T");
  const [inputs, setInputs] = useState({
    booker_first_name: "",
    booker_last_name: "",
    booker_phone: "",
    booker_email: "",
    booker_occasion: "",
    booker_request: "",
  });

  const [disabled, setDisabled] = useState(true);
  const [didBooked, setDidBooked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const booking = await createReservation({
      name,
      partySize: parseInt(partySize),
      day,
      time,
      booker_first_name: inputs.booker_first_name,
      booker_last_name: inputs.booker_last_name,
      booker_phone: inputs.booker_phone,
      booker_email: inputs.booker_email,
      booker_occasion: inputs.booker_occasion,
      booker_request: inputs.booker_request,
      setDidBooked,
    });
  };

  useEffect(() => {
    if (
      inputs.booker_first_name &&
      inputs.booker_last_name &&
      inputs.booker_email &&
      inputs.booker_phone
    ) {
      return setDisabled(false);
    }

    setDisabled(true);
    return () => {};
  }, [inputs]);

  return (
    <>
      {didBooked ? (
        <div>
          <h1 className="text-center">Thank you for your reservation!</h1>
        </div>
      ) : (
        <div className="mt-10 flex flex-wrap justify-between w-[660px]">
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            name="booker_first_name"
            value={inputs.booker_first_name}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last name"
            name="booker_last_name"
            value={inputs.booker_last_name}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            name="booker_phone"
            value={inputs.booker_phone}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            name="booker_email"
            value={inputs.booker_email}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (optional)"
            name="booker_occasion"
            value={inputs.booker_occasion}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            name="booker_request"
            value={inputs.booker_request}
            onChange={(e) => handleInputChange(e)}
          />
          <button
            disabled={disabled || loading}
            onClick={() => handleSubmit()}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
          >
            {loading ? "Loading..." : "Complete reservation"}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </div>
      )}
    </>
  );
}

export default Form;
