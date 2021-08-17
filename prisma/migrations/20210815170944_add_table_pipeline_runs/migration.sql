-- CreateTable
CREATE TABLE "PipelineRuns" (
    "id" SERIAL NOT NULL,
    "arweaveId" VARCHAR(44) NOT NULL,
    "runId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PipelineRuns.arweaveId_unique" ON "PipelineRuns"("arweaveId");

-- CreateIndex
CREATE INDEX "PipelineRuns.arweaveId_index" ON "PipelineRuns"("arweaveId");
