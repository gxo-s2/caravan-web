import { Request, Response } from 'express';
import { CaravanService } from './caravan.service';
// 👇 [중요] 수정 기능을 위해 추가된 부분
import { prisma } from '../prisma'; 

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

        if (!name || !description || !location || !pricePerDay || !capacity || typeof hostId !== 'string') {
            return res.status(400).json({ message: 'Missing required fields or invalid Host ID type.' });
        }
        
        const newCaravan = await caravanService.createCaravan({
            name,
            description,
            location,
            pricePerDay: Number(pricePerDay), 
            capacity: Number(capacity),
            images,
        }, hostId); 

        res.status(201).json({ id: newCaravan.id, message: 'Caravan created successfully' });
        
    } catch (error: any) {
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
    if (error.message.includes('예약이 존재하여')) {
      return res.status(409).json({ message: error.message }); 
    }
    res.status(500).json({ message: error.message });
  }
};

// --- 5. 카라반 수정 (우리가 고친 부분) ---
export const updateCaravan = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`[DEBUG] 수정 요청 ID: ${id}`);

  // images는 테스트를 위해 잠시 제외 (원하시면 다시 추가 가능)
  const { name, location, pricePerDay, description, capacity } = req.body;

  try {
    const updatedCaravan = await prisma.caravan.update({
      where: { id: id }, 
      data: {
        name,
        location,
        pricePerDay: Number(pricePerDay),
        capacity: Number(capacity),
        description,
        // images: images // 테스트 후 주석 해제하세요
      },
    });

    console.log("✅ 수정 성공:", updatedCaravan);
    res.status(200).json(updatedCaravan);

  } catch (error: any) {
    console.error("❌ 수정 실패 진짜 이유:", error); 
    res.status(500).json({ 
      message: '서버 에러 발생', 
      errorDetail: error.message 
    });
  }
};

// --- 6. 전체 카라반 목록 조회 ---
export const getAllCaravans = async (req: Request, res: Response) => {
  try {
    const allCaravans = await caravanService.getAllCaravans();
    res.status(200).json(allCaravans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};