import { useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    async function getPizzaOfTheDay() {
      setLoading("pizzaOfTheDay", true);
      try {
        const response = await fetch("/api/pizza-of-the-day");
        const data = await response.json();
        setPizzaOfTheDay(data);
      } catch (error) {
        console.error("Failed to fetch pizza of the day:", error);
      } finally {
        setLoading("pizzaOfTheDay", false);
      }
    }

    getPizzaOfTheDay();
  }, []); // Remove setLoading from dependencies to prevent infinite loop

  return pizzaOfTheDay;
};
