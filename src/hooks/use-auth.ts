import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { LoginRequest, CreateUserRequest, UserFull, Token, UserResponse } from "@/lib/types";

export function useUser() {
  return useQuery<UserFull>({
    queryKey: ["/user/me"],
    queryFn: () => fetchApi("/user"),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const res = await fetchApi<Token>("/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      localStorage.setItem("access_token", res.access_token);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/user/me"] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      return fetchApi<UserResponse>("/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("access_token");
    queryClient.clear();
    window.location.href = "/login";
  };
}
