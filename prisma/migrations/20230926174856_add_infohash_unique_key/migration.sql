/*
  Warnings:

  - A unique constraint covering the columns `[infoHash]` on the table `Release` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Release_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Release_infoHash_key" ON "Release"("infoHash");

-- CreateIndex
CREATE INDEX "Release_id_infoHash_idx" ON "Release"("id", "infoHash");
