import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample CRM data...');

  // Sample Clients erstellen
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        companyName: 'Müller GmbH',
        firstName: 'Hans',
        lastName: 'Müller',
        email: 'h.mueller@mueller-gmbh.de',
        phone: '+49 123 456789',
        city: 'München',
        address: 'Marienplatz 1',
        zipCode: '80331',
        journeyStage: 'KUNDE',
        statusText: 'Aktiver Kunde seit 2024',
        notes: 'Sehr zufrieden mit unserem Service',
      }
    }),
    prisma.client.create({
      data: {
        companyName: 'Schmidt Consulting AG',
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'a.schmidt@schmidt-consulting.de',
        phone: '+49 987 654321',
        city: 'Berlin',
        address: 'Unter den Linden 45',
        zipCode: '10117',
        journeyStage: 'VIP',
        statusText: 'Premium-Kunde',
        notes: 'Hoher Umsatz, wichtiger Geschäftspartner',
      }
    }),
    prisma.client.create({
      data: {
        companyName: 'Tech Solutions GmbH',
        firstName: 'Peter',
        lastName: 'Wagner',
        email: 'p.wagner@techsolutions.de',
        phone: '+49 555 123456',
        city: 'Hamburg',
        address: 'Reeperbahn 33',
        zipCode: '20359',
        journeyStage: 'AMBASSADOR',
        statusText: 'Aktiver Promoter',
        notes: 'Empfiehlt uns aktiv weiter, sehr zufrieden',
      }
    }),
    prisma.client.create({
      data: {
        companyName: null,
        firstName: 'Maria',
        lastName: 'Weber',
        email: 'm.weber@email.de',
        phone: '+49 777 888999',
        city: 'Frankfurt',
        address: 'Zeil 50',
        zipCode: '60313',
        journeyStage: 'INTERESSENT',
        statusText: 'Erstgespräch geführt',
        notes: 'Interesse an Premium-Paket',
      }
    }),
    prisma.client.create({
      data: {
        companyName: 'Meyer & Partner mbH',
        firstName: 'Thomas',
        lastName: 'Meyer',
        email: 't.meyer@meyer-partner.de',
        phone: '+49 444 555666',
        city: 'Köln',
        address: 'Domplatz 7',
        zipCode: '50667',
        journeyStage: 'KUNDE',
        statusText: 'Regelmäßiger Kunde',
        notes: 'Monatliche Bestellungen',
      }
    }),
    prisma.client.create({
      data: {
        companyName: 'Digital Factory GmbH',
        firstName: 'Sarah',
        lastName: 'Hoffmann',
        email: 's.hoffmann@digitalfactory.de',
        phone: '+49 333 222111',
        city: 'Stuttgart',
        address: 'Königstraße 22',
        zipCode: '70173',
        journeyStage: 'INTERESSENT',
        statusText: 'Demo angefragt',
        notes: 'Interesse an Jahresvertrag',
      }
    }),
  ]);

  console.log(`✅ Created ${clients.length} clients`);

  // Sample Activities für die Clients erstellen
  for (const client of clients) {
    await prisma.activity.createMany({
      data: [
        {
          clientId: client.id,
          type: 'EMAIL',
          title: 'Willkommens-Email versendet',
          description: 'Erstkontakt hergestellt',
          createdBy: 'system',
        },
        {
          clientId: client.id,
          type: 'CALL',
          title: 'Telefonat geführt',
          description: 'Bedarf analysiert',
          createdBy: 'admin',
        },
      ]
    });
  }

  console.log('✅ Created sample activities');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
