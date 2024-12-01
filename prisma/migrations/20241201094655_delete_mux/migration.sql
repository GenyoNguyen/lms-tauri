/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the `MuxData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MuxData" DROP CONSTRAINT "MuxData_chapterId_fkey";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "videoUrl",
ADD COLUMN     "videoId" TEXT;

-- DropTable
DROP TABLE "MuxData";
