-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "brand" TEXT,
    "imageUrl" TEXT,
    "qrcodeUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeenDrop" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "message" TEXT,
    "imageUrl" TEXT,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "SeenDrop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeenDrop" ADD CONSTRAINT "SeenDrop_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
