import { useQuery } from "./useQuery";
import getPizzaOfTheDay from "./api/getPizzaOfTheDay";

export const usePizzaOfTheDay = () => {
  const { data: pizzaOfTheDay } = useQuery({
    queryKey: ["pizza-of-the-day"],
    queryFn: ({ signal }) => getPizzaOfTheDay({ signal }),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes - pizza of the day doesn't change often
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
  });

  return pizzaOfTheDay;
};
