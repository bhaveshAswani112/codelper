/*
  Warnings:

  - You are about to drop the column `note` on the `Question` table. All the data in the column will be lost.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "note",
ADD COLUMN     "title" TEXT NOT NULL;
