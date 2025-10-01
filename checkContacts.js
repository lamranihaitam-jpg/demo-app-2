// Simple script to print latest contacts using Prisma
// Run: npx prisma generate && node checkContacts.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  try{
    const rows = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    console.log('Derniers contacts ('+rows.length+'):\n', rows);
    const count = await prisma.contact.count();
    console.log('\nTotal contacts: ', count);
  }catch(e){
    console.error('Erreur:', e.message || e);
  }finally{
    await prisma.$disconnect();
  }
}

main();
