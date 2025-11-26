export interface Payment {
  id: string;
  amount: number;
  status: "COMPLETED" | "FAILED" | "CANCELLED"; // ✔ 백엔드 기준에 맞게 수정됨
  createdAt: string; // ✔ API 응답은 string 형태로 오므로 string 유지
  reservation: {
    caravan: {
      name: string;
    };
  };
}
