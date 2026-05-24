ALTER TABLE `user`
  ADD COLUMN `username` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `User_username_key` ON `user`(`username`);
