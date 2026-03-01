import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useGetPairingCode() {
  return useMutation({
    mutationFn: async (number: string) => {
      // Construct URL with query parameters since it's a GET request
      const searchParams = new URLSearchParams({ number });
      const url = `${api.pairing.getCode.path}?${searchParams.toString()}`;
      
      const res = await fetch(url, {
        method: api.pairing.getCode.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });

      if (!res.ok) {
        let errorMessage = "SYSTEM ERROR: INITIALIZATION FAILED";
        try {
          const errorData = await res.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // If JSON parse fails, fallback to default message
        }
        throw new Error(`⚠️ ${errorMessage}`);
      }

      const data = await res.json();
      return api.pairing.getCode.responses[200].parse(data);
    },
  });
}
