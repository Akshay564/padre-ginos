import { useQuery as useReactQuery } from "@tanstack/react-query";

// Simplified wrapper - no manual loading tracking needed
// QueryGlobalLoader automatically detects React Query states
export const useQuery = (options) => {
  return useReactQuery(options);
};
