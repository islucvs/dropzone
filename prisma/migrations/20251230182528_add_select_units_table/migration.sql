-- AlterTable
ALTER TABLE "units" ADD COLUMN     "can_be_transported" BOOLEAN DEFAULT false,
ADD COLUMN     "max_capacity" INTEGER,
ADD COLUMN     "transport_capacity" JSONB,
ADD COLUMN     "transport_size" INTEGER;

-- CreateTable
CREATE TABLE "selected_units" (
    "id" SERIAL NOT NULL,
    "unit_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "selected_order" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL DEFAULT 'default_user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "selected_units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "selected_units_unit_id_user_id_key" ON "selected_units"("unit_id", "user_id");

-- AddForeignKey
ALTER TABLE "selected_units" ADD CONSTRAINT "selected_units_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("unit_id") ON DELETE CASCADE ON UPDATE CASCADE;
