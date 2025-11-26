import { Request, Response } from 'express';
import { CaravanService } from './caravan.service';

const caravanService = new CaravanService();

// --- 1. 단일 카라반 상세 조회 ---
export const getCaravanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const caravan = await caravanService.getCaravanById(id); 

    if (caravan == null) { 
      return res.status(404).json({ message: 'Caravan not found.' });
    }
    
    res.status(200).json(caravan);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching caravan details.' });
  }
};

// --- 2. 호스트별 카라반 목록 조회 ---
export const getCaravansByHost = async (req: Request, res: Response) => {
  try {
    const { hostId } = req.params;
    const caravans = await caravanService.getCaravansByHostId(hostId);
    res.status(200).json(caravans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. 카라반 생성 ---
export const createCaravan = async (req: Request, res: Response) => {
    try {
        const { name, description, location, pricePerDay, capacity, images, hostId } = req.body;

        // 1. 필수 필드 체크: hostId는 문자열 타입으로 체크합니다.
        if (!name || !description || !location || !pricePerDay || !capacity || typeof hostId !== 'string') {
            return res.status(400).json({ message: 'Missing required fields or invalid Host ID type.' });
        }
        
        // 2. 서비스 호출 시, Number() 변환과 문자열 타입 유지
        const newCaravan = await caravanService.createCaravan({
            name,
            description,
            location,
            pricePerDay: Number(pricePerDay), 
            capacity: Number(capacity),
            images,
        }, hostId); // hostId는 이미 문자열이므로 Number()를 사용하지 않습니다.

        // 3. 성공 응답: 데이터 전체 대신 생성 ID와 상태만 반환하여 응답 처리를 간소화합니다.
        res.status(201).json({ id: newCaravan.id, message: 'Caravan created successfully' });
        
    } catch (error: any) {
        // 4. 에러 로깅 후 응답
        console.error("Caravan creation failed:", error);
        res.status(500).json({ message: 'Internal server error during caravan creation.' });
    }
};

// --- 4. 카라반 삭제 ---
export const deleteCaravan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await caravanService.deleteCaravan(id);
    res.status(200).json({ message: '카라반이 성공적으로 삭제되었습니다.' });
  } catch (error: any) {
    // 서비스에서 던진 특정 에러 메시지를 클라이언트에게 전달
    if (error.message.includes('예약이 존재하여')) {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
    res.status(500).json({ message: error.message });
  }
};

// --- 5. 전체 카라반 목록 조회 ---
export const getAllCaravans = async (req: Request, res: Response) => {
  try {
    const allCaravans = await caravanService.getAllCaravans();
    res.status(200).json(allCaravans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};