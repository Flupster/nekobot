-- CreateTable
CREATE TABLE "Release" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "comments" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL,
    "infoHash" TEXT NOT NULL,
    "leechers" INTEGER NOT NULL,
    "remake" BOOLEAN NOT NULL,
    "seeders" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "trusted" BOOLEAN NOT NULL,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Release_id_idx" ON "Release"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_id_idx" ON "Category"("id");

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
