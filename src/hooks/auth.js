import { useEffect } from "react";
import {
  useTokenVerifyMutation,
  useRefreshTokenMutation,
} from "@/lib/service/api";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [verifyToken] = useTokenVerifyMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const parsedToken = JSON.parse(token);

      const verifyAndRefresh = async () => {
        try {
          await verifyToken(parsedToken.access).unwrap();
        } catch (error) {
          if (error?.status === 401) {
            try {
              const refreshResponse = await refreshToken(
                parsedToken.refresh
              ).unwrap();
              localStorage.setItem(
                "authToken",
                JSON.stringify(refreshResponse)
              );
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              localStorage.removeItem("authToken");
              router.push("/login");
            }
          } else {
            console.error("Token verification failed:", error);
          }
        }
      };

      verifyAndRefresh();
    } else {
      router.push("/login");
    }
  }, [verifyToken, refreshToken, router]);
};
