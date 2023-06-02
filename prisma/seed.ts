import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dirPath = path.resolve(__dirname, '..', 'data', 'emoticon');
const fileList = fs.readdirSync(dirPath);

async function seed() {
  for (const file of fileList) {
    const filePath = dirPath + '/' + file;
    const data = fs.readFileSync(filePath, 'utf-8');
    const { info, emoticons } = JSON.parse(data);
    const { name, author, reference, thumbnail } = info;
    const list = await prisma.emoticonList.create({
      data: {
        name: file.split('.').at(0) as string,
        presented: name,
        author,
        reference,
        thumbnail,
      },
    });
    for (const emoticon of emoticons) {
      await prisma.emoticon.create({
        data: { ...emoticon, list: { connect: { id: list.id } } },
      });
    }
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
