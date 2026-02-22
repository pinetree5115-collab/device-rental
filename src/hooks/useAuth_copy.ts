import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/providers/AuthProvider";
import * as authService from "@/services/auth_copy.service";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { user, isAuthenticated, logout: logoutContext } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await authService.login({ email, password });

            // 로그인 상태 stale 제거
            queryClient.invalidateQueries({ queryKey: ["myInfo"] });

            // 로그인 성공 후 메인 페이지로 이동
            router.push("/");

            return data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "로그인에 실패했습니다.";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);

            // 서버에 로그아웃 요청
            await authService.logout();

            // 로컬 상태 및 저장소 초기화
            logoutContext();

            // 로그인 페이지로 이동
            router.push("/login");
        } catch (err) {
            console.error("로그아웃 실패:", err);
            // 에러가 발생해도 로컬 상태는 초기화
            logoutContext();
            router.push("/login");
        } finally {
            setIsLoading(false);
        }
    };

    // const handleSignup = async (
    //     email: string,
    //     password: string,
    //     name: string | null = null,
    //     request: string | null = null,
    // ) => {
    //     try {
    //         setIsLoading(true);
    //         setError(null);

    //         const data = await authService.signup({
    //             email,
    //             password,
    //             name,
    //             request,
    //         });

    //         // 회원가입 후 자동 로그인
    //         login(data.user, data.token);

    //         router.push("/");

    //         return data;
    //     } catch (err) {
    //         const errorMessage =
    //             err instanceof Error ? err.message : "회원가입에 실패했습니다.";
    //         setError(errorMessage);
    //         throw err;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        logout: handleLogout,
        // signup: handleSignup,
    };
}
