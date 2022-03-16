-- Remove all tables that existed before

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `School`;
DROP TABLE IF EXISTS `Role`;
DROP TABLE IF EXISTS `GroupUser`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Group`;
DROP TABLE IF EXISTS `SubmittedAction`;
DROP TABLE IF EXISTS `Action`;
DROP TABLE IF EXISTS `ActionQuiz`;
DROP TABLE IF EXISTS `ActionItem`;
DROP TABLE IF EXISTS `ActionQuizAnswer`;

SET FOREIGN_KEY_CHECKS = 1;



-- Create tables: 

CREATE TABLE `User` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) UNIQUE NOT NULL,
  `name` text NOT NULL,
  `email` varchar(50) UNIQUE NOT NULL,
  `avatar` text,
  `school_id` int
);

CREATE TABLE `Role` (
  `user_id` int PRIMARY KEY,
  `role` ENUM ('student', 'educator', 'administrator', 'user') NOT NULL
);

CREATE TABLE `Action` (
  `action_id` int PRIMARY KEY AUTO_INCREMENT,
  `action_name` varchar(255) NOT NULL UNIQUE COMMENT 'ex. "Transportation"',
  `page_media` text COMMENT 'points to s3 bucket where it is stored',
  `action_icon` text COMMENT 's3 bucket png/jpg image',
  `fallback_quiz_media` text COMMENT 'points to s3 bucket where it is stored'
);

CREATE TABLE `ActionItem` (
  `action_id` int NOT NULL,
  `item_name` varchar(255) NOT NULL COMMENT 'ex. ["Distance walked (km)", "Distance biked (km)", "Distance transited (km)"] ',
  `item_description` text NOT NULL COMMENT 'ex. ["How far you walked", "How far you cycled", "How far you took public transit"]',
  `co2_saved_per_unit` float8 NOT NULL COMMENT 'ex, [180.0, 180.0, 100.0]',
  PRIMARY KEY (`action_id`, `item_name`)
);

CREATE TABLE `ActionQuiz` (
  `quiz_id` int PRIMARY KEY AUTO_INCREMENT,
  `fact_text` text NOT NULL,
  `question_text` text NOT NULL,
  `action_id` int NOT NULL
);

CREATE TABLE `ActionQuizAnswer` (
  `quiz_id` int NOT NULL,
  `answer` varchar(255) NOT NULL COMMENT 'this should be an index?',
  `is_correct_answer` bool NOT NULL,
  PRIMARY KEY (`quiz_id`, `answer`)
);

CREATE TABLE `SubmittedAction` (
  `sa_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT 'index on this',
  `action_id` int NOT NULL,
  `quiz_id` int,
  `g_co2_saved` float NOT NULL,
  `date_of_action` date NOT NULL,
  `time_sumbitted` datetime,
  `first_quiz_answer_correct` boolean NOT NULL,
  `quiz_answered` boolean NOT NULL,
  `is_validated` boolean NOT NULL
);

CREATE TABLE `Group` (
  `group_id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `image` text
);

CREATE TABLE `GroupUser` (
  `group_id` int,
  `user_id` int COMMENT 'only educator and administrator roles can own/make a group',
  `user_role` ENUM ('owner', 'member') NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`)
);

CREATE TABLE `School` (
  `school_id` int PRIMARY KEY AUTO_INCREMENT,
  `school_name` text NOT NULL,
  `country` text,
  `city` text
);


-- Adding foreign keys

ALTER TABLE `User` ADD FOREIGN KEY (`school_id`) REFERENCES `School` (`school_id`) ON DELETE SET NULL ON UPDATE SET NULL;

ALTER TABLE `Role` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ActionItem` ADD FOREIGN KEY (`action_id`) REFERENCES `Action` (`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ActionQuiz` ADD FOREIGN KEY (`action_id`) REFERENCES `Action` (`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ActionQuizAnswer` ADD FOREIGN KEY (`quiz_id`) REFERENCES `ActionQuiz` (`quiz_id`) ON DELETE CASCADE;

ALTER TABLE `SubmittedAction` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SubmittedAction` ADD FOREIGN KEY (`action_id`) REFERENCES `Action` (`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SubmittedAction` ADD FOREIGN KEY (`quiz_id`) REFERENCES `ActionQuiz` (`quiz_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `GroupUser` ADD FOREIGN KEY (`group_id`) REFERENCES `Group` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GroupUser` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- Populate all tables with test data

INSERT INTO `User` VALUES
(null, 'michael', 'Michael', 'woolsey@example.com', null, null);
INSERT INTO `User` VALUES
(null, 'christy', 'Christy', 'christy@example.com', null, null);
INSERT INTO School VALUES
(null, 'UBC', 'Canada', 'Vancouver');
INSERT INTO `User` VALUES
(null, 'teststudent', 'Knott Payingattention', 'student@example.com', null,
 (select school_id from School where school_name='UBC'));
INSERT INTO `User` VALUES
(null, 'testeducator', 'Readin Lotsabooks', 'educator@example.com', null,
 (select school_id from School where school_name='UBC'));

INSERT INTO Role VALUES
((select user_id from `User` where username='teststudent'), "student");
INSERT INTO Role VALUES
((select user_id from `User` where username='testeducator'), "educator");
INSERT INTO Role VALUES
((select user_id from `User` where username='michael'), "administrator");
INSERT INTO Role VALUES
((select user_id from `User` where username='christy'), "administrator");


INSERT INTO `Group` VALUES
(null, 'Test group', "This is a test group\'s description!", null);

INSERT INTO GroupUser VALUES
((select group_id from `Group` where name='Test group'),
(select user_id from `User` where username='teststudent'),
'member');
INSERT INTO GroupUser VALUES
((select group_id from `Group` where name='Test group'),
(select user_id from `User` where username='testeducator'),
'owner');


INSERT INTO Action VALUES
(null, 'Transportation', null, null, null);
INSERT INTO Action VALUES
(null, 'Reducing Plastic Waste', null, null, null);
INSERT INTO Action VALUES
(null, 'Plant Based Meals', null, null, null);


INSERT INTO ActionItem VALUES
((select action_id from Action where action_name='Transportation'), 
'Distance walked (km)', 'How many kilometers you walked', 180.0),
((select action_id from Action where action_name='Transportation'), 
'Distance cycled (km)', 'How many kilometers you cycled', 180.0),
((select action_id from Action where action_name='Transportation'), 
'Distance transited (km)', 'How many kilometers you took public transit (like a bus or a train)', 100.0);

INSERT INTO ActionItem VALUES
((select action_id from Action where action_name='Reducing Plastic Waste'), 
'Tap water drank (mL)', 'How many mililiters of tap water you drank', 0.1656);

INSERT INTO ActionItem VALUES
((select action_id from Action where action_name='Plant Based Meals'), 
'Number of plant based meals', 'How many plant based meals you ate', 20.0);


INSERT INTO ActionQuiz VALUES
(null, 'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the biggest role, contributing 35% of the total CO2 production.',
"What percentage of an average Canadian's total CO2 production is due to transportation?", 
(select action_id from `Action` where action_name='Transportation'));

INSERT INTO ActionQuizAnswer VALUES
(
	(select quiz_id from ActionQuiz where question_text="What percentage of an average Canadian's total CO2 production is due to transportation?"),
	"55%",
    false
),
(
	(select quiz_id from ActionQuiz where question_text="What percentage of an average Canadian's total CO2 production is due to transportation?"),
	"20%",
    false
),
(
	(select quiz_id from ActionQuiz where question_text="What percentage of an average Canadian's total CO2 production is due to transportation?"),
	"35%",
    true
),
(
	(select quiz_id from ActionQuiz where question_text="What percentage of an average Canadian's total CO2 production is due to transportation?"),
	"70%",
    false
);


INSERT INTO ActionQuiz VALUES
(null, 'As of 2019, the average Canadian drank water at some point in their life!',
"Here is a test question!", 
(select action_id from `Action` where action_name='Reducing Plastic Waste'));	

INSERT INTO ActionQuizAnswer VALUES
(
	(select quiz_id from ActionQuiz where fact_text='As of 2019, the average Canadian drank water at some point in their life!'),
	"True",
    true
),
(
	(select quiz_id from ActionQuiz where fact_text='As of 2019, the average Canadian drank water at some point in their life!'),
	"False",
    false
);


INSERT INTO ActionQuiz VALUES
(null, 'Plants are delicious',
"Tofu is good for you!", 
(select action_id from `Action` where action_name='Plant Based Meals'));

INSERT INTO ActionQuizAnswer VALUES
(
	(select quiz_id from ActionQuiz where fact_text='Plants are delicious'),
	"True",
    true
),
(
	(select quiz_id from ActionQuiz where fact_text='Plants are delicious'),
	"False",
    false
);


INSERT INTO SubmittedAction VALUES
(
null,
(select user_id from `User` where username="teststudent"),
(select action_id from `Action` where action_name="Transportation"),
(select quiz_id from `ActionQuiz` where action_id=(select action_id from `Action` where action_name="Transportation") LIMIT 1),
100.0,
current_date() - interval floor(rand() * 14) day, -- generates random date
current_timestamp() - interval floor(rand() * 10000) second,
true,
true, 
true
),
(
null,
(select user_id from `User` where username="teststudent"),
(select action_id from `Action` where action_name="Plant Based Meals"),
(select quiz_id from `ActionQuiz` where action_id=(select action_id from `Action` where action_name="Plant Based Meals") LIMIT 1),
40.0,
current_date() - interval floor(rand() * 14) day, -- generates random date
current_timestamp() - interval floor(rand() * 10000) second,
false,
true, 
false
);

SELECT * FROM `SubmittedAction`;
