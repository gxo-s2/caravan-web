import { Request, Response } from 'express';
// ✅ [수정] 클래스가 아닌 함수들을 직접 import 합니다.
import * as userService from './user.service';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

// ❌ [삭제] 클래스 인스턴스 생성 코드 제거
// const userService = new UserService();

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, contactNumber, profilePicture, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    if (role && !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: `Invalid role: ${role}. Must be one of ${Object.values(Role).join(', ')}.` });
    }

    // ✅ [수정] 함수 직접 호출
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const userData = {
      email,
      password,
      name,
      contactNumber: contactNumber || null,
      profilePicture: profilePicture || null,
      role: role || Role.GUEST,
      isVerified: false 
    };

    // ✅ [수정] 함수 직접 호출
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // ✅ [수정] 함수 직접 호출
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a user's profile information by their ID.
 * GET /api/users/:id
 */
export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // ✅ [수정] 함수 직접 호출 (별칭 사용)
        const user = await userService.getUserProfile(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        res.status(200).json(user);

    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: error.message || 'Failed to fetch user profile.' });
    }
};

/**
 * Update a user's profile information (name, contact number).
 * PATCH /api/users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, contactNumber } = req.body;

        if (!name && !contactNumber) {
            return res.status(400).json({ message: 'Update data is required (name or contactNumber).' });
        }

        // ✅ [수정] 함수 직접 호출 (별칭 사용)
        const updatedUser = await userService.updateUserProfile(id, { name, contactNumber });
        res.status(200).json(updatedUser);

    } catch (error: any) {
        console.error("Error updating user profile:", error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: 'User not found for update.' });
        }

        res.status(500).json({ message: error.message || 'Failed to update user profile.' });
    }
};