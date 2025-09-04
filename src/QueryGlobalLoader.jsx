import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const QueryGlobalLoader = () => {
  // Use predicate to exclude queries marked with excludeFromGlobalLoader meta
  const isFetching = useIsFetching({
    predicate: (query) => {
      // Exclude queries that have excludeFromGlobalLoader meta property
      return !query.meta?.excludeFromGlobalLoader;
    },
  });

  const isMutating = useIsMutating(); // Tracks all mutations (POST, PUT, etc.)

  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  // Determine loading message based on what's happening
  const getLoadingMessage = () => {
    if (isMutating > 0) {
      return {
        title: "Processing...",
        subtitle: "Please wait while we save your changes",
      };
    }
    if (isFetching > 0) {
      return {
        title: "Loading...",
        subtitle: "Please wait while we prepare everything for you",
      };
    }
    return {
      title: "Loading...",
      subtitle: "Please wait...",
    };
  };

  const { title, subtitle } = getLoadingMessage();

  return (
    <div className="global-loader">
      <div className="global-loader-backdrop">
        <div className="global-loader-content">
          <div className="spinner"></div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {/* Debug info in development */}
          {process.env.NODE_ENV === "development" && (
            <small style={{ marginTop: "1rem", opacity: 0.7 }}>
              Fetching: {isFetching} | Mutating: {isMutating}
            </small>
          )}
        </div>
      </div>
      <style>{`
        .global-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
        }
        
        .global-loader-backdrop {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .global-loader-content {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .global-loader h2 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }
        
        .global-loader p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default QueryGlobalLoader;
