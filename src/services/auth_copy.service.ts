import apiClient from "./api_copy.service";
import type {
    LoginRequest,
    LoginApiResponse,
    SignupRequest,
    SignupApiResponse,
    MeApiResponse,
    AuthSuccessResponse,
    User,
} from "@/types/auth";

interface LoginSuccessResponse {
    success: boolean;
}

export async function login(data: LoginRequest): Promise<LoginSuccessResponse> {
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
        return { success: true };
    } else {
        throw new Error(responseData.error || "로그인에 실패했습니다.");
    }
}

export async function signup(
    data: SignupRequest,
): Promise<AuthSuccessResponse> {
    const response = await apiClient.post<SignupApiResponse>(
        "/api/users",
        data,
    );
    const apiData = response.data;

    return {
        user: {
            id: data.email,
            email: data.email,
            name: data.name,
        },
        token: apiData.token,
        message: apiData.message,
    };
}

export async function logout(): Promise<void> {
    await apiClient.post("/api/users/logout");
}

export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<MeApiResponse>("/auth/me");
    const apiData = response.data;

    return {
        id: apiData.userId,
        email: apiData.email,
        name: apiData.name,
    };
}

export async function sendVerificationCode(email: string): Promise<unknown> {
    const response = await apiClient.post("/auth/send-code", { email });
    return response.data;
}

export async function verifyCode(
    email: string,
    code: string,
): Promise<unknown> {
    const response = await apiClient.post("/auth/verify-code", { email, code });
    return response.data;
}

export const getMyInfoApi = async () => {
    try {
        const fetchResponse = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const response = await fetchResponse.json();

        if (response.success) {
            return response.data;
        }
        return null;
    } catch (err) {
        console.error("Failed to fetch my info:::", err);
        return null;
    }
};
