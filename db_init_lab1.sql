START TRANSACTION;

CREATE TABLE `individual` (
  `id` bigint PRIMARY KEY,
  `firstName` varchar(127) NOT NULL,
  `secondName` varchar(127) NOT NULL,
  `fathersName` varchar(127),
  `passport` bigint NOT NULL,
  `INN` bigint NOT NULL,
  `SNILS` bigint NOT NULL,
  `driverLicense` bigint,
  `addDocs` text,
  `note` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `individual` (id, firstName, secondName, fathersName, passport, INN, SNILS) VALUES
(17, 'Baranov', 'Ivanov', 'Sergeevich', 2364612342, 752635723695, 1712746971);

COMMIT;