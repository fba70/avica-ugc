-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stripePaymentLinkPriceId" TEXT;

-- AlterTable
ALTER TABLE "ProductInstance" ADD COLUMN     "priceOneoff" DOUBLE PRECISION,
ADD COLUMN     "priceRecurring" DOUBLE PRECISION,
ADD COLUMN     "stripePaymentLinkPriceId" TEXT;
