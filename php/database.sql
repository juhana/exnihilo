CREATE TABLE `final_words` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `word` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `playthroughs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL,
  `ip` varchar(30) DEFAULT NULL,
  `used` int(11) NOT NULL DEFAULT '0',
  `side` varchar(10) NOT NULL,
  `nodes` varchar(255) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
