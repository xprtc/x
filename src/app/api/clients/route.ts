import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/clients - Alle Clients abrufen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get('stage');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (stage && stage !== 'all') {
      where.journeyStage = stage;
    }
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        activities: {
          take: 5,
          orderBy: { date: 'desc' }
        }
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST /api/clients - Neuen Client erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const client = await prisma.client.create({
      data: {
        companyName: body.companyName,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        city: body.city,
        address: body.address,
        zipCode: body.zipCode,
        country: body.country || 'Deutschland',
        journeyStage: body.journeyStage || 'INTERESSENT',
        statusText: body.statusText || 'Neu erfasst',
        notes: body.notes,
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email bereits vorhanden' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}