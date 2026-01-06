-- CreateTable
CREATE TABLE "raffle_entries" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "raffleId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "tokenTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_41d589422354bba645c284cf174" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "type" TEXT,
    "image" TEXT,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "canWinInMultipleTokenTypes" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_052c636fce78a0481c29fab2aa1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffles_token_types_token_types" (
    "rafflesId" INTEGER NOT NULL,
    "tokenTypesId" INTEGER NOT NULL,

    CONSTRAINT "PK_b7a3b707c156fe1d72ced7435e7" PRIMARY KEY ("rafflesId","tokenTypesId")
);

-- CreateTable
CREATE TABLE "token_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_5fa323bb0f8485f93e436f392a6" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" INTEGER NOT NULL,
    "metaData" JSON NOT NULL,
    "tokenTypeId" INTEGER NOT NULL,

    CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "publicAddress" VARCHAR NOT NULL,
    "nonce" VARCHAR NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "winners" (
    "id" SERIAL NOT NULL,
    "raffleEntryId" INTEGER NOT NULL,
    "tokenTypeId" INTEGER NOT NULL,
    "raffleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_45701ddf409cead5c6e92a12ce8" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e4f62e076a51ff3e5b55fa011b7" ON "raffle_entries"("tokenTypeId", "raffleId", "tokenId", "walletId");

-- CreateIndex
CREATE INDEX "IDX_2c4c91f65c34952202bf089815" ON "raffles_token_types_token_types"("rafflesId");

-- CreateIndex
CREATE INDEX "IDX_6c820c674e9b3d2f886169338c" ON "raffles_token_types_token_types"("tokenTypesId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_080c763a9498ef4e96d41ac5c82" ON "token_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_d9ca2654d38b97b5530e6d1f21a" ON "wallets"("publicAddress");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_a83538ffcc797a3fd2367c6935c" ON "wallets"("nonce");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f10e50de39dae2cce93c9b8b734" ON "winners"("raffleEntryId", "tokenTypeId");

-- AddForeignKey
ALTER TABLE "raffle_entries" ADD CONSTRAINT "FK_6d43618e516322e2ba3e8a0e10f" FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_entries" ADD CONSTRAINT "FK_592b168703a09e446fde5287e9e" FOREIGN KEY ("tokenTypeId") REFERENCES "token_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_entries" ADD CONSTRAINT "FK_0b3777639833567619be585e4f7" FOREIGN KEY ("tokenId") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_entries" ADD CONSTRAINT "FK_23cc0977e7f94832ec827f48b59" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles_token_types_token_types" ADD CONSTRAINT "FK_2c4c91f65c34952202bf089815f" FOREIGN KEY ("rafflesId") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles_token_types_token_types" ADD CONSTRAINT "FK_6c820c674e9b3d2f886169338cd" FOREIGN KEY ("tokenTypesId") REFERENCES "token_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "FK_4873e709f3349e93488a6d5a60d" FOREIGN KEY ("tokenTypeId") REFERENCES "token_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "FK_177f7285f0c5a4eab8fe365fc20" FOREIGN KEY ("raffleEntryId") REFERENCES "raffle_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "FK_9b138ca0564261339ff8b68d315" FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "FK_cf7a11f4dfd5acbab374ad37fee" FOREIGN KEY ("tokenTypeId") REFERENCES "token_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
