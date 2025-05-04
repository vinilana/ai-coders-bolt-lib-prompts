/*
  Warnings:

  - You are about to drop the column `author_id` on the `prompts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_author_id_fkey";

-- DropIndex
DROP INDEX "prompts_author_id_idx";

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "author_id";
