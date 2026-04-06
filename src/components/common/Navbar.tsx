"use client";

import { getMyInfoApi } from "@/services/auth_copy.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, User, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginModal } from "@/components/common/LoginModal";
import Link from "next/link";

export function Navbar() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const { data: user } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfoApi,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isLoggedIn = !!user;

    const onNavigate = (path: string) => {
        router.push(`/${path}`);
    };

    const onLoginToggle = async () => {
        if (isLoggedIn) {
            await fetch("/api/logout", {
                method: "POST",
            }).then(() => {
                queryClient.invalidateQueries({ queryKey: ["myInfo"] });
                router.push("/");
            });
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return (
        <>
            {/* Top Banner */}
            <div className="bg-black text-white py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>
                            개인 전자기기 대여 플랫폼에 오신 것을 환영합니다
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left: Logo & Menu */}
                        <div className="flex items-center gap-12">
                            <Link
                                href="/"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <Package className="w-8 h-8 text-gray-900" />
                                <span className="text-2xl tracking-tight text-gray-900">
                                    전자기기 대여
                                </span>
                            </Link>

                            {/* Menu Items */}
                            <div className="hidden md:flex items-center gap-8">
                                <button
                                    onClick={() => onNavigate("")}
                                    className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                                >
                                    물품 목록
                                </button>
                                <button
                                    onClick={() => onNavigate("coupon")}
                                    className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                                >
                                    쿠폰
                                </button>
                                {isLoggedIn && (
                                    <>
                                        <button
                                            onClick={() => onNavigate("point")}
                                            className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                                        >
                                            포인트
                                        </button>
                                        <button
                                            onClick={() =>
                                                onNavigate("items/rent/history")
                                            }
                                            className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                                        >
                                            내 대여
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-6">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => onNavigate("mypage")}
                                        className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="text-sm hidden sm:inline">
                                            마이페이지
                                        </span>
                                    </button>
                                    <button
                                        onClick={onLoginToggle}
                                        className="flex items-center gap-2 px-6 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-sm">
                                            로그아웃
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onLoginToggle}
                                    className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span className="text-sm">로그인</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
}
