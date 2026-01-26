interface PointsPageProps {
    onBack: () => void;
}

interface PointHistory {
    id: string;
    date: string;
    type: "earn" | "use";
    description: string;
    amount: number;
    balance: number;
}

const mockPointHistory: PointHistory[] = [
    {
        id: "1",
        date: "2025-01-15",
        type: "earn",
        description: "캠핑용 블루투스 스피커 대여 완료",
        amount: 3000,
        balance: 15000,
    },
    {
        id: "2",
        date: "2025-01-12",
        type: "use",
        description: "노트북 대여 시 포인트 사용",
        amount: 5000,
        balance: 12000,
    },
    {
        id: "3",
        date: "2025-01-10",
        type: "earn",
        description: "액션캠 대여 완료",
        amount: 2000,
        balance: 17000,
    },
    {
        id: "4",
        date: "2025-01-08",
        type: "use",
        description: "태블릿 대여 시 포인트 사용",
        amount: 3000,
        balance: 15000,
    },
    {
        id: "5",
        date: "2025-01-05",
        type: "earn",
        description: "드론 대여 완료",
        amount: 5000,
        balance: 18000,
    },
    {
        id: "6",
        date: "2025-01-03",
        type: "earn",
        description: "신규 회원 가입 적립",
        amount: 10000,
        balance: 13000,
    },
    {
        id: "7",
        date: "2025-01-01",
        type: "earn",
        description: "이벤트 참여 보너스",
        amount: 3000,
        balance: 3000,
    },
];

function PointsPage({ onBack }: PointsPageProps) {
    const currentBalance = mockPointHistory[0]?.balance || 0;

    const totalEarned = mockPointHistory
        .filter((h) => h.type === "earn")
        .reduce((sum, h) => sum + h.amount, 0);

    const totalUsed = mockPointHistory
        .filter((h) => h.type === "use")
        .reduce((sum, h) => sum + h.amount, 0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.5 15L7.5 10L12.5 5"
                                stroke="#4A5565"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>뒤로 가기</span>
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.6667 18.6667C15.085 18.6667 18.6667 15.085 18.6667 10.6667C18.6667 6.24847 15.085 2.66675 10.6667 2.66675C6.24847 2.66675 2.66675 6.24847 2.66675 10.6667C2.66675 15.085 6.24847 18.6667 10.6667 18.6667Z"
                                stroke="#F0B100"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M24.12 13.8267C25.3804 14.2966 26.5019 15.0767 27.381 16.0949C28.26 17.1131 28.868 18.3366 29.1489 19.6521C29.4298 20.9676 29.3745 22.3327 28.988 23.6211C28.6015 24.9096 27.8964 26.0798 26.9379 27.0235C25.9793 27.9672 24.7982 28.654 23.5039 29.0203C22.2096 29.3866 20.8438 29.4207 19.5329 29.1193C18.2219 28.8179 17.0081 28.1908 16.0037 27.296C14.9993 26.4012 14.2368 25.2676 13.7866 24"
                                stroke="#F0B100"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9.33325 8H10.6666V13.3333"
                                stroke="#F0B100"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22.28 18.5066L23.2134 19.4533L19.4534 23.2133"
                                stroke="#F0B100"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <h1 className="text-gray-900">포인트</h1>
                    </div>
                    <p className="text-gray-600">
                        대여 완료 시 포인트가 적립되며, 결제 시 사용할 수
                        있습니다
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Current Balance */}
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-8 col-span-1 md:col-span-3">
                        <div className="flex items-center gap-2 mb-3">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M18.0901 10.3701C19.0354 10.7225 19.8766 11.3076 20.5358 12.0713C21.1951 12.835 21.6512 13.7526 21.8618 14.7392C22.0725 15.7258 22.031 16.7496 21.7411 17.716C21.4513 18.6823 20.9224 19.5599 20.2035 20.2677C19.4846 20.9755 18.5988 21.4906 17.6281 21.7653C16.6573 22.0401 15.633 22.0656 14.6498 21.8396C13.6666 21.6135 12.7562 21.1432 12.0029 20.4721C11.2496 19.801 10.6777 18.9508 10.3401 18.0001"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M7 6H8V10"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16.7101 13.8799L17.4101 14.5899L14.5901 17.4099"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <h2 className="text-white">보유 포인트</h2>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl">
                                {currentBalance.toLocaleString()}
                            </span>
                            <span className="text-2xl">P</span>
                        </div>
                        <p className="mt-4 text-yellow-100">
                            1P = 1원으로 사용 가능합니다
                        </p>
                    </div>

                    {/* Total Earned */}
                    <div className="bg-white border-2 border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-3 text-green-600">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.3334 5.8335L11.2501 12.9168L7.08341 8.75016L1.66675 14.1668"
                                    stroke="#00A63E"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.3333 5.8335H18.3333V10.8335"
                                    stroke="#00A63E"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <h3 className="text-gray-900">총 적립</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl text-gray-900">
                                {totalEarned.toLocaleString()}
                            </span>
                            <span className="text-gray-600">P</span>
                        </div>
                    </div>

                    {/* Total Used */}
                    <div className="bg-white border-2 border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-3 text-red-600">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.3334 14.1668L11.2501 7.0835L7.08341 11.2502L1.66675 5.8335"
                                    stroke="#E7000B"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.3333 14.1665H18.3333V9.1665"
                                    stroke="#E7000B"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <h3 className="text-gray-900">총 사용</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl text-gray-900">
                                {totalUsed.toLocaleString()}
                            </span>
                            <span className="text-gray-600">P</span>
                        </div>
                    </div>

                    {/* Available to Use */}
                    <div className="bg-white border-2 border-blue-200 p-6">
                        <div className="flex items-center gap-2 mb-3 text-blue-600">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6.6665 11.6665C9.42793 11.6665 11.6665 9.42793 11.6665 6.6665C11.6665 3.90508 9.42793 1.6665 6.6665 1.6665C3.90508 1.6665 1.6665 3.90508 1.6665 6.6665C1.6665 9.42793 3.90508 11.6665 6.6665 11.6665Z"
                                    stroke="#155DFC"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15.075 8.6416C15.8628 8.93529 16.5638 9.42288 17.1132 10.0593C17.6625 10.6957 18.0426 11.4603 18.2182 12.2825C18.3937 13.1047 18.3591 13.9579 18.1176 14.7631C17.876 15.5684 17.4353 16.2998 16.8362 16.8896C16.2371 17.4794 15.499 17.9087 14.69 18.1376C13.8811 18.3666 13.0275 18.3879 12.2081 18.1995C11.3888 18.0111 10.6301 17.6192 10.0024 17.0599C9.37465 16.5007 8.89806 15.7922 8.6167 14.9999"
                                    stroke="#155DFC"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M5.8335 5H6.66683V8.33333"
                                    stroke="#155DFC"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.9249 11.5669L14.5082 12.1586L12.1582 14.5086"
                                    stroke="#155DFC"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <h3 className="text-gray-900">사용 가능</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl text-gray-900">
                                {currentBalance.toLocaleString()}
                            </span>
                            <span className="text-gray-600">P</span>
                        </div>
                    </div>
                </div>

                {/* Point History */}
                <div className="bg-white border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-gray-900">포인트 내역</h2>
                    </div>

                    {mockPointHistory.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500">
                                아직 포인트 내역이 없습니다
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {mockPointHistory.map((history) => (
                                <div
                                    key={history.id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {history.type === "earn" ? (
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 text-green-700">
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M14.6666 4.6665L8.99992 10.3332L5.66659 6.99984L1.33325 11.3332"
                                                                stroke="#008236"
                                                                strokeWidth="1.33333"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M10.6667 4.6665H14.6667V8.6665"
                                                                stroke="#008236"
                                                                strokeWidth="1.33333"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>

                                                        <span className="text-sm">
                                                            적립
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700">
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M14.6666 11.3332L8.99992 5.6665L5.66659 8.99984L1.33325 4.6665"
                                                                stroke="#C10007"
                                                                strokeWidth="1.33333"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M10.6667 11.3335H14.6667V7.3335"
                                                                stroke="#C10007"
                                                                strokeWidth="1.33333"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>

                                                        <span className="text-sm">
                                                            사용
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(history.date)}
                                                </span>
                                            </div>
                                            <p className="text-gray-900 mb-1">
                                                {history.description}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                잔액:{" "}
                                                {history.balance.toLocaleString()}
                                                P
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`text-xl ${
                                                    history.type === "earn"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {history.type === "earn"
                                                    ? "+"
                                                    : "-"}
                                                {history.amount.toLocaleString()}
                                                P
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Notice */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200">
                    <h3 className="text-gray-900 mb-3">포인트 안내</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                            • 대여가 정상적으로 완료되면 대여 금액의 5%가
                            포인트로 적립됩니다.
                        </li>
                        <li>
                            • 포인트는 1P = 1원으로 결제 시 현금처럼 사용할 수
                            있습니다.
                        </li>
                        <li>
                            • 포인트는 최소 1,000P 이상부터 사용 가능합니다.
                        </li>
                        <li>
                            • 적립된 포인트는 적립일로부터 1년간 유효합니다.
                        </li>
                        <li>• 대여 취소 시 사용한 포인트는 즉시 환원됩니다.</li>
                        <li>
                            • 포인트는 타인에게 양도하거나 현금으로 환급할 수
                            없습니다.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default PointsPage;
