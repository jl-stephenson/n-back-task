import { FormEvent, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTrialContext } from "@/contexts/TrialContext";

export function Landing() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useTrialContext();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName === "") {
      setError("Please enter your name");
      return;
    }

    dispatch({ type: "name_given", name: trimmedName });
    navigate({ to: "/intro" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 items-center text-xl"
    >
      <label htmlFor="name">Enter your name:</label>
      <input
        id="name"
        placeholder="Name"
        value={name}
        className="text-center border-b-2 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(event) => {
          setName(event?.currentTarget.value);
          if (error) setError("");
        }}
        aria-required="true"
      />
      {error && (
        <p role="alert" className="text-red-500 text-[1rem]">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="border-2 p-2 hover:cursor-pointer hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
      >
        Continue
      </button>
    </form>
  );
}
