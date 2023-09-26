import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const items = [
  { id: "1_1", name: "Anime - Anime Music Video" },
  { id: "1_2", name: "Anime - English-translated" },
  { id: "1_3", name: "Anime - Non-English-translated" },
  { id: "1_4", name: "Anime - Raw" },
  { id: "2_1", name: "Audio - Lossless" },
  { id: "2_2", name: "Audio - Lossy" },
  { id: "3_1", name: "Literature - English-translated" },
  { id: "3_2", name: "Literature - Non-English-translated" },
  { id: "3_3", name: "Literature - Raw" },
  { id: "4_1", name: "Live Action - English-translated" },
  { id: "4_2", name: "Live Action - Idol/Promotional Video" },
  { id: "4_3", name: "Live Action - Non-English-translated" },
  { id: "4_4", name: "Live Action - Raw" },
  { id: "5_1", name: "Pictures - Graphics" },
  { id: "5_2", name: "Pictures - Photos" },
  { id: "6_1", name: "Software - Applications" },
  { id: "6_2", name: "Software - Games" },
]

for (const category of items) {
  await prisma.category
    .create({ data: category })
    .then((r) => console.log("Created:", category))
    .catch((x) => {
      if (x.code !== "P2002") console.error(x)
    })
}
