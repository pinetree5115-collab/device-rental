import { Loader2 } from "lucide-react";
import { cn } from "@/utils/utils";

interface LoadingSpinnerProps {
    /** 스피너 크기 */
    size?: "sm" | "md" | "lg" | "xl";
    /** 중앙 정렬 여부 */
    centered?: boolean;
    /** 표시할 텍스트 (선택) */
    text?: string;
    /** 추가 CSS 클래스 */
    className?: string;
    /** 전체 화면 오버레이 */
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
};

export function LoadingSpinner({
    size = "md",
    centered = false,
    text,
    className,
    fullScreen = false,
}: LoadingSpinnerProps) {
    const spinner = (
        <div
            className={cn(
                "flex items-center gap-3",
                centered && "justify-center",
                className,
            )}
        >
            <Loader2
                className={cn(sizeClasses[size], "animate-spin text-primary")}
            />
            {text && <span className="text-muted-foreground">{text}</span>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <Loader2
                        className={cn(
                            sizeClasses[size],
                            "animate-spin text-primary",
                        )}
                    />
                    {text && (
                        <span className="text-muted-foreground">{text}</span>
                    )}
                </div>
            </div>
        );
    }

    if (centered) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                {spinner}
            </div>
        );
    }

    return spinner;
}

// 간단한 스피너만 필요한 경우를 위한 인라인 컴포넌트
export function Spinner({
    size = "md",
    className,
}: {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}) {
    return (
        <Loader2 className={cn(sizeClasses[size], "animate-spin", className)} />
    );
}
