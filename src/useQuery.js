import { useQuery as useReactQuery } from "@tanstack/react-query";
import { useLoading } from "./LoadingContext";
import { useEffect, useMemo, useRef } from "react";

export const useQuery = (options) => {
  const { setLoading, removeLoading } = useLoading();
  const result = useReactQuery(options);
  const cleanupRef = useRef(null);

  const loadingKey = useMemo(
    () => `query-${JSON.stringify(options.queryKey)}`,
    [options.queryKey],
  );

  useEffect(() => {
    setLoading(loadingKey, result.isLoading || result.isFetching);

    // Store cleanup function in ref
    cleanupRef.current = () => removeLoading(loadingKey);

    // Cleanup function to remove loading state when component unmounts
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [result.isLoading, result.isFetching, loadingKey]);

  return result;
};
