/*
  Warnings:

  - A unique constraint covering the columns `[pageName]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pageName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "pageName" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pageName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_pageName_key" ON "Event"("pageName");

-- CreateIndex
CREATE UNIQUE INDEX "User_pageName_key" ON "User"("pageName");
