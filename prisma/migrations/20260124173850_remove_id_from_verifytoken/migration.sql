/*
  Warnings:

  - The primary key for the `VerifyPasswordReset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VerifyPasswordReset` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VerifyPasswordReset" (
    "used" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VerifyPasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VerifyPasswordReset" ("createdAt", "token", "used", "userId") SELECT "createdAt", "token", "used", "userId" FROM "VerifyPasswordReset";
DROP TABLE "VerifyPasswordReset";
ALTER TABLE "new_VerifyPasswordReset" RENAME TO "VerifyPasswordReset";
CREATE UNIQUE INDEX "VerifyPasswordReset_token_key" ON "VerifyPasswordReset"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
