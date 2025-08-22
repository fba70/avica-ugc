-- AlterTable
ALTER TABLE "public"."SeenDrop" ADD COLUMN     "status" TEXT DEFAULT 'active';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" TEXT DEFAULT 'active';
