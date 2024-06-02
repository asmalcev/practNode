START TRANSACTION;

CREATE TABLE `body` (
  `id` bigint PRIMARY KEY,
  `type` varchar(127) NOT NULL,
  `galaxy` varchar(127) NOT NULL,
  `accuracy` float NOT NULL,
  `intensity` bigint NOT NULL,
  `linkedObjects` varchar(127) NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `object` (
  `id` bigint PRIMARY KEY,
  `type` varchar(127) NOT NULL,
  `accuracy` float NOT NULL,
  `count` bigint NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `position` (
  `id` bigint PRIMARY KEY,
  `earthPosition` point NOT NULL,
  `sunPosition` point NOT NULL,
  `moonPosition` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sector` (
  `id` bigint PRIMARY KEY,
  `coords` point NOT NULL,
  `intensity` bigint NOT NULL,
  `objects` varchar(127) NOT NULL,
  `bodyCount` bigint NOT NULL,
  `undefinedBodyCount` bigint NOT NULL,
  `specifiedBodyCount` bigint NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

COMMIT;