export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(getAuthHeaders() as Record<string, string>),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON error responses
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
