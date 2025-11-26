import { PrismaClient, Caravan, User } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type CaravanCreationData = Omit<Caravan, 'id' | 'createdAt' | 'updatedAt' | 'hostId'>;

export class CaravanService {
  /**
   * 단일 카라반을 ID로 조회하며, 리뷰 평균 및 개수를 포함합니다.
   * @param id 카라반의 UUID (String)
   */
  async getCaravanById(id: string) { // Return type will be inferred
    const caravan = await prisma.caravan.findUnique({
      where: { id },
      include: {
        host: {
          select: { id: true, name: true, profilePicture: true }
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!caravan) return null;

    const aggregate = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        caravanId: id,
      },
    });

    return {
      ...caravan,
      reviews_avg: aggregate._avg.rating || 0,
      reviews_count: caravan._count.reviews,
    };
  }

  /**
   * 특정 호스트가 등록한 모든 카라반 목록을 조회합니다.
   * @param hostId 호스트의 UUID
   */
  async getCaravansByHostId(hostId: string): Promise<Caravan[]> {
    return prisma.caravan.findMany({
      where: { hostId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 카라반을 삭제합니다.
   * @param id 삭제할 카라반의 UUID
   */
  async deleteCaravan(id: string): Promise<Caravan> {
    // 1. 해당 카라반에 연결된 예약이 있는지 확인합니다.
    const existingReservations = await prisma.reservation.findFirst({
      where: { 
        caravanId: id,
        // Optional: 아직 완료되지 않은 예약만 확인할 경우
        // status: { in: ['PENDING', 'CONFIRMED'] } 
      },
    });

    if (existingReservations) {
      throw new Error('이 카라반에 대한 예약이 존재하여 삭제할 수 없습니다.');
    }
    
    // 2. 연결된 리뷰를 먼저 삭제합니다. (Relation 제약조건)
    await prisma.review.deleteMany({
      where: { caravanId: id },
    });

    // 3. 카라반을 삭제합니다.
    return prisma.caravan.delete({
      where: { id },
    });
  }

  /**
   * Create a new caravan
   * @param data Caravan data (pricePerDay, capacity 등)
   * @param hostId The ID of the host user (string UUID)
   */
  async createCaravan(data: CaravanCreationData, hostId: string): Promise<Caravan> {
    const host = await prisma.user.findUnique({
      where: { id: hostId },
    });

    if (!host || host.role !== 'HOST') {
      throw new Error('User is not a host.');
    }
    
    const caravanData: Prisma.CaravanCreateInput = {
      name: data.name,
      description: data.description,
      location: data.location,
      pricePerDay: data.pricePerDay,
      capacity: data.capacity,
      images: data.images as string[],
      host: {
        connect: {
          id: hostId
        }
      }
    };

    return prisma.caravan.create({
      data: caravanData,
    });
  }

  /**
   * Get all caravans
   */
  async getAllCaravans(): Promise<Caravan[]> {
    return prisma.caravan.findMany();
  }
}