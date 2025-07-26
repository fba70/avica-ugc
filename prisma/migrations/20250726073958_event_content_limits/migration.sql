-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "imagesCount" INTEGER DEFAULT 0,
ADD COLUMN     "limitImages" INTEGER DEFAULT 0,
ADD COLUMN     "limitVideos" INTEGER DEFAULT 0,
ADD COLUMN     "videosCount" INTEGER DEFAULT 0;
