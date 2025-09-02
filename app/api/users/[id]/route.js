import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/users/[id] - Get user by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is requesting their own data or is an admin
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        influencer: session.user.role === 'INFLUENCER',
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const data = await request.json();
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is updating their own data
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        influencer: session.user.role === 'INFLUENCER',
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: data.username || user.username,
        email: data.email || user.email,
      },
      include: {
        influencer: session.user.role === 'INFLUENCER',
      },
    });
    
    // Update influencer profile if user is an influencer
    if (session.user.role === 'INFLUENCER' && user.influencer) {
      await prisma.influencer.update({
        where: { id: user.influencer.id },
        data: {
          platform: data.platform || user.influencer.platform,
          followers: data.followers || user.influencer.followers,
          engagementRate: data.engagementRate || user.influencer.engagementRate,
          niche: data.niche || user.influencer.niche,
        },
      });
      
      // Refresh user data with updated influencer profile
      const refreshedUser = await prisma.user.findUnique({
        where: { id },
        include: {
          influencer: true,
        },
      });
      
      return NextResponse.json(refreshedUser);
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is deleting their own account
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

