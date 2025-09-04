import { useQuery as useReactQuery } from "@tanstack/react-query";

// Simple wrapper that just passes through to React Query
// No manual loading tracking needed since QueryGlobalLoader handles it automatically
export const useQuery = (options) => {
  return useReactQuery(options);
};
