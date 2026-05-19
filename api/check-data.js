import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const kigaliPosts = await prisma.post.findMany({
    where: { city: 'Kigali' }
  });
  console.log(`Found ${kigaliPosts.length} posts in Kigali.`);
  
  const agents = await prisma.user.findMany({
    where: { role: 'agent' }
  });
  console.log(`Found ${agents.length} agents.`);
  
  process.exit(0);
}

checkData();
