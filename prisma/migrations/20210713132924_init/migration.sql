-- CreateTable
CREATE TABLE "Wallets" (
    "id" SERIAL NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "pubkey" VARCHAR(44) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallets.pubkey_unique" ON "Wallets"("pubkey");

-- CreateIndex
CREATE INDEX "Wallets.pubkey_index" ON "Wallets"("pubkey");
