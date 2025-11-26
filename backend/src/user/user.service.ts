import prisma from '../prisma'; 
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * 유저 ID로 상세 정보 조회 (비밀번호 제외)
 */
export const getUserById = async (userId: string): Promise<Partial<User> | null> => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      contactNumber: true,
      profilePicture: true,
      isVerified: true,
      createdAt: true,
      // password는 보안상 제외
    },
  });
};

/**
 * 유저 생성 (회원가입 등에서 사용)
 */
export const createUser = async (userData: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * 이메일로 유저 찾기 (로그인 시 사용)
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * 유저 정보 업데이트
 */
export const updateUser = async (userId: string, data: { name?: string; contactNumber?: string }): Promise<Partial<User>> => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      contactNumber: true,
      role: true,
      isVerified: true,
    },
  });
};

// 기존 호환성을 위해 (필요하다면) 남겨두거나, 위 함수들을 직접 사용하도록 유도합니다.
export const getUserProfile = getUserById;
export const updateUserProfile = updateUser;