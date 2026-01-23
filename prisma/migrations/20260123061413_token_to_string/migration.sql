-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PendingUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PendingUser" ("createdAt", "email", "id", "passwordHash", "token") SELECT "createdAt", "email", "id", "passwordHash", "token" FROM "PendingUser";
DROP TABLE "PendingUser";
ALTER TABLE "new_PendingUser" RENAME TO "PendingUser";
CREATE UNIQUE INDEX "PendingUser_email_key" ON "PendingUser"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
