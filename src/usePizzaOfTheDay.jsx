import { useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
  const { setLoading, removeLoading } = useLoading();

  useEffect(() => {
    const abortController = new AbortController();

    async function getPizzaOfTheDay() {
      setLoading("pizzaOfTheDay", true);
      try {
        const response = await fetch("/api/pizza-of-the-day", {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPizzaOfTheDay(data);
      } catch (error) {
        // Only log error if it's not an abort error
        if (error.name !== "AbortError") {
          console.error("Failed to fetch pizza of the day:", error);
        }
      } finally {
        setLoading("pizzaOfTheDay", false);
      }
    }

    getPizzaOfTheDay();

    // Cleanup function to abort the request and remove loading state
    return () => {
      abortController.abort();
      removeLoading("pizzaOfTheDay");
    };
  }, []); // Empty dependencies to prevent infinite loop

  return pizzaOfTheDay;
};
