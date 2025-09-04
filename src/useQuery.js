import { useQuery as useReactQuery } from "@tanstack/react-query";
import { useLoading } from "./LoadingContext";
import { useEffect, useMemo } from "react";

export const useQuery = (options) => {
  const { setLoading } = useLoading();
  const result = useReactQuery(options);
  
  const loadingKey = useMemo(() => `query-${JSON.stringify(options.queryKey)}`, [options.queryKey]);
  
  useEffect(() => {
    setLoading(loadingKey, result.isLoading || result.isFetching);
  }, [result.isLoading, result.isFetching, loadingKey]); // Remove setLoading from deps
  
  return result;
};
