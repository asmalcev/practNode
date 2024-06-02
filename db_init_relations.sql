START TRANSACTION;

CREATE TABLE `relation` (
  `id` bigint PRIMARY KEY,
  `objectId` bigint NOT NULL,
  `sectorId` bigint NOT NULL,
  `bodyId` bigint NOT NULL,
  `positionId` bigint NOT NULL,
  FOREIGN KEY (`objectId`) REFERENCES `object` (`id`),
  FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  FOREIGN KEY (`bodyId`) REFERENCES `body` (`id`),
  FOREIGN KEY (`positionId`) REFERENCES `position` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

COMMIT;

