import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
      },
    });

    // Create associated profile based on role
    if (role === 'BUSINESS') {
      await prisma.business.create({
        data: {
          userId: user.id,
          companyName: name, // Default to user name, can be updated later
        },
      });
    } else if (role === 'INFLUENCER') {
      await prisma.influencer.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

