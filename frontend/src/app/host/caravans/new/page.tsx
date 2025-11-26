"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewCaravanPage() {
    const router = useRouter();

    // 입력 폼 상태 관리
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [capacity, setCapacity] = useState("");
    
    // 로그인한 유저 정보 저장용
    const [user, setUser] = useState<{ id: string; role: string } | null>(null);

    // 1. 페이지 로드 시 로그인 정보 확인
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            alert("로그인이 필요합니다.");
            router.push("/auth/login");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        
        if (parsedUser.role !== "HOST") {
            alert("호스트만 접근할 수 있습니다.");
            router.push("/");
            return;
        }
        
        setUser(parsedUser);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.id) {
            alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
            return;
        }

        try {
            const payload = {
                name,
                description,
                location,
                pricePerDay: Number(pricePerNight), 
                capacity: Number(capacity),
                hostId: user.id,
                images: ["https://placehold.co/600x400"], 
            };

            await axios.post("http://localhost:3001/api/caravans", payload);

            alert("카라반이 성공적으로 등록되었습니다!");
            
            // 2. 100ms 대기 후, 3. window.location.replace() 호출
            setTimeout(() => {
                window.location.replace("/host/caravans/manage");
            }, 100);

        } catch (error: any) {
            console.error("등록 실패 상세 로그:", error);

            if (error.response && error.response.data) {
                alert(`등록 실패: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("카라반 등록에 실패했습니다. (서버 응답 없음)");
            }
        }
    };

    if (!user) return <div className="text-center py-20">로그인 정보를 확인 중입니다...</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                내 카라반 등록하기
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">카라반 이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="예: 숲속 힐링 캠핑카"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="카라반의 특징을 설명해주세요."
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">위치</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="예: 강원도 춘천"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">1박 가격 (원)</label>
                    <input
                        type="number"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="예: 150000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">수용 인원</label>
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="예: 4"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    등록하기
                </button>
            </form>
        </div>
    );
}