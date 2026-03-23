// 1. import
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfoApi } from "@/services/auth_copy.service";

// 2. 타입/인터페이스
interface UserProfile {
    name: string;
    email: string;
    address: string;
    point: string;
}

interface Statistics {
    registeredItems: number;
    activeRentals: number;
    points: number;
}

// 3. 상수
const SIDEBAR_MENU = [
    {
        id: "profile-management",
        label: "프로필 관리",
        items: [
            { id: "my-profile", label: "내 프로필", href: "/mypage" },
            {
                id: "change-password",
                label: "비밀번호 변경",
                href: "/mypage/password",
            },
        ],
    },
    {
        id: "rental-management",
        label: "나의 대여",
        items: [
            {
                id: "rental-history",
                label: "대여 내역",
                href: "/items/rent/history",
            },
            { id: "my-items", label: "내 물품 관리", href: "/items/manage" },
        ],
    },
    {
        id: "points",
        label: "포인트",
        items: [{ id: "points", label: "포인트", href: "/point" }],
    },
    {
        id: "logout",
        label: "로그아웃",
        items: [{ id: "logout", label: "로그아웃", href: "#" }],
    },
] as const;

// 4. 컴포넌트
export default function MyPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: "홍길동",
        email: "user@example.com",
        address: "",
        point: "0",
    });
    const [originalProfile, setOriginalProfile] = useState<UserProfile>({
        name: "홍길동",
        email: "user@example.com",
        address: "",
        point: "0",
    });

    const { data: user } = useQuery({
        queryKey: ["userInfo"],
        queryFn: getMyInfoApi,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    useEffect(() => {
        setProfile((prev) => ({
            ...prev,
            name: user?.name || prev.name,
            email: user?.email || prev.email,
            point: user?.point || prev.point,
        }));
    }, [user]);

    const [statistics] = useState<Statistics>({
        registeredItems: 3,
        activeRentals: 2,
        points: 15000,
    });

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setOriginalProfile(profile);
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/users/edit", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                    address: profile.address,
                }),
            });

            if (!response.ok) {
                throw new Error("프로필 업데이트 실패");
            }

            queryClient.invalidateQueries({ queryKey: ["userInfo"] });

            setIsEditing(false);
        } catch (error) {
            alert("프로필 수정에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["myInfo"] });
            router.push("/");
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 메인 콘텐츠 */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-medium text-gray-900 mb-8">
                    내 계정
                </h1>
                <div className="flex gap-8">
                    {/* 사이드바 */}
                    <aside className="w-64 flex-shrink-0">
                        <nav className="bg-white  p-4">
                            {SIDEBAR_MENU.map((section) => (
                                <div
                                    key={section.id}
                                    className="mb-6 last:mb-0"
                                >
                                    <h3 className="text-base font-medium text-gray-900 mb-2">
                                        {section.label}
                                    </h3>
                                    <ul className="space-y-1">
                                        {section.items.map((item) => {
                                            const isActive =
                                                item.id === "my-profile";
                                            const isLogout =
                                                item.id === "logout";

                                            if (isLogout) {
                                                return (
                                                    <li key={item.id}>
                                                        <button
                                                            onClick={
                                                                handleLogout
                                                            }
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            {item.label}
                                                        </button>
                                                    </li>
                                                );
                                            }

                                            return (
                                                <li key={item.id}>
                                                    <Link
                                                        href={item.href}
                                                        className={`block px-3 py-2 text-sm ${
                                                            isActive
                                                                ? " text-red-600 font-medium"
                                                                : "text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* 메인 콘텐츠 영역 */}
                    <main className="flex-1">
                        <h2 className="flex items-center gap-2 text-xl font-medium text-red-600 mb-6">
                            <span className="w-1 h-6 bg-red-600"></span>
                            프로필 정보
                        </h2>

                        <div className="bg-white border border-gray-200 p-8">
                            <div className="space-y-6">
                                {/* 이름 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        이름
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        placeholder="홍길동"
                                    />
                                </div>

                                {/* 이메일 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        이메일
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        placeholder="user@example.com"
                                    />
                                </div>

                                {/* 주소 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        주소
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "address",
                                                e.target.value,
                                            )
                                        }
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        placeholder="서울특별시 강남구"
                                    />
                                </div>

                                {/* 버튼 영역 */}
                                <div className="flex justify-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleCancel}
                                                disabled={isLoading}
                                                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                취소
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                                className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {isLoading
                                                    ? "저장 중..."
                                                    : "변경사항 저장"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEditClick}
                                            className="px-6 py-2 bg-red-500 text-white hover:bg-red-600"
                                        >
                                            수정하기
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 통계 카드 */}
                        <div className="grid grid-cols-3 gap-6 mt-6">
                            {/* 등록한 물품 */}
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#EF4444"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line
                                            x1="12"
                                            y1="22.08"
                                            x2="12"
                                            y2="12"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    등록한 물품
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {statistics.registeredItems}
                                </p>
                            </div>

                            {/* 진행 중 대여 */}
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#EF4444"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    진행 중 대여
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {statistics.activeRentals}
                                </p>
                            </div>

                            {/* 보유 포인트 */}
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#EF4444"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    보유 포인트
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {profile.point}
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// 5. export
