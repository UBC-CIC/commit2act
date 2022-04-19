SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS `Role`;
DROP TABLE IF EXISTS GroupUser;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Group`;
DROP TABLE IF EXISTS SubmittedActionItem;
DROP TABLE IF EXISTS SubmittedAction;
DROP TABLE IF EXISTS `Action`;
DROP TABLE IF EXISTS ActionQuiz;
DROP TABLE IF EXISTS ActionItem;
DROP TABLE IF EXISTS ActionQuizAnswer;


SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE `User` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) UNIQUE NOT NULL,
  `name` text NOT NULL,
  `email` varchar(50) UNIQUE NOT NULL,
  `avatar` text,
  UNIQUE INDEX (username)
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
  PRIMARY KEY ( `item_name`, `action_id`)
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
  `time_submitted` datetime,
  `first_quiz_answer_correct` boolean NOT NULL,
  `quiz_answered` boolean NOT NULL,
  `is_validated` boolean NOT NULL,
  `points_earned` int DEFAULT 0
);

CREATE TABLE `SubmittedActionItem` (
	`item_name` varchar(255),
    `sa_id` int,
    `input_value` float8,
    PRIMARY KEY (`item_name`, `sa_id`)
);

CREATE TABLE `Group` (
  `group_id` int PRIMARY KEY AUTO_INCREMENT,
  `group_name` varchar(255) NOT NULL UNIQUE,
  `group_description` text,
  `group_image` text,
  `is_public` boolean DEFAULT true,
  `private_password` text DEFAULT null
);

CREATE TABLE `GroupUser` (
  `group_id` int,
  `user_id` int COMMENT 'only educator and administrator roles can own/make a group',
  `user_role` ENUM ('owner', 'member') NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`)
);


ALTER TABLE `Role` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ActionItem` ADD FOREIGN KEY (`action_id`) REFERENCES `Action` (`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ActionQuiz` ADD FOREIGN KEY (`action_id`) REFERENCES `Action` (`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ActionQuizAnswer` ADD FOREIGN KEY (`quiz_id`) REFERENCES `ActionQuiz` (`quiz_id`) ON DELETE CASCADE;

ALTER TABLE `SubmittedAction` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SubmittedAction` ADD FOREIGN KEY (`action_id`) REFERENCES `Action` (`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SubmittedAction` ADD FOREIGN KEY (`quiz_id`) REFERENCES `ActionQuiz` (`quiz_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `GroupUser` ADD FOREIGN KEY (`group_id`) REFERENCES `Group` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GroupUser` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SubmittedActionItem` ADD FOREIGN KEY (`sa_id`) REFERENCES `SubmittedAction` (`sa_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SubmittedActionItem` ADD FOREIGN KEY (`item_name`) REFERENCES `ActionItem` (`item_name`) ON DELETE CASCADE ON UPDATE CASCADE;


INSERT INTO `User` VALUES
(null, 'michael', 'Michael', 'woolsey@example.com', null);
INSERT INTO `User` VALUES
(null, 'christy', 'Christy', 'christy@example.com', null);
INSERT INTO `User` VALUES
(null, 'teststudent', 'Knott Payingattention', 'student@example.com', null);
INSERT INTO `User` VALUES
(null, 'testeducator', 'Readin Lotsabooks', 'educator@example.com', null);

INSERT INTO Role VALUES
((select user_id from `User` where username='teststudent'), "student");
INSERT INTO Role VALUES
((select user_id from `User` where username='testeducator'), "educator");
INSERT INTO Role VALUES
((select user_id from `User` where username='michael'), "administrator");
INSERT INTO Role VALUES
((select user_id from `User` where username='christy'), "administrator");


INSERT INTO `Group` VALUES
(null, 'Test group', "This is a test group\'s description!", null, true, null);
INSERT INTO `Group` VALUES
(null, 'Test group 2', "This is a test group\'s 2 description!", "image.png", false, "password");
INSERT INTO `Group` VALUES
(null, 'Test group 3', "This is test group\'s 3 description!", "image3.png", true, null);

INSERT INTO GroupUser VALUES
((select group_id from `Group` where group_name='Test group'),
(select user_id from `User` where username='teststudent'),
'member');
INSERT INTO GroupUser VALUES
((select group_id from `Group` where group_name='Test group 3'),
(select user_id from `User` where username='teststudent'),
'member');
INSERT INTO GroupUser VALUES
((select group_id from `Group` where group_name='Test group'),
(select user_id from `User` where username='testeducator'),
'owner');
INSERT INTO GroupUser VALUES
((select group_id from `Group` where group_name='Test group'),
(select user_id from `User` where username='michael'),
'member');
INSERT INTO GroupUser VALUES
((select group_id from `Group` where group_name='Test group 2'),
(select user_id from `User` where username='michael'),
'owner');
INSERT INTO GroupUser VALUES
((select group_id from `Group` where group_name='Test group 3'),
(select user_id from `User` where username='michael'),
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
(null, 'Yummy plants mmmmm yum',
"I like plants and tofu and brussel sprouts!", 
(select action_id from `Action` where action_name='Plant Based Meals'));

INSERT INTO ActionQuizAnswer VALUES
(
	(select quiz_id from ActionQuiz where fact_text='Yummy plants mmmmm yum'),
	"True",
    true
),
(
	(select quiz_id from ActionQuiz where fact_text='Yummy plants mmmmm yum'),
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
true, 
110
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
false,
40
),
(
null,
(select user_id from `User` where username="michael"),
(select action_id from `Action` where action_name="Plant Based Meals"),
(select quiz_id from `ActionQuiz` where action_id=(select action_id from `Action` where action_name="Plant Based Meals") LIMIT 1),
60.0,
current_date() - interval floor(rand() * 14) day, -- generates random date
current_timestamp() - interval floor(rand() * 10000) second,
false,
true, 
false,
60
),
(
null,
(select user_id from `User` where username="michael"),
(select action_id from `Action` where action_name="Transportation"),
(select quiz_id from `ActionQuiz` where action_id=(select action_id from `Action` where action_name="Transportation") LIMIT 1),
260.0,
current_date() - interval floor(rand() * 14) day, -- generates random date
current_timestamp() - interval floor(rand() * 10000) second,
false,
true, 
false,
260
),
(
null,
(select user_id from `User` where username="michael"),
(select action_id from `Action` where action_name="Plant Based Meals"),
(select quiz_id from `ActionQuiz` where action_id=(select action_id from `Action` where action_name="Plant Based Meals") LIMIT 1),
20.0,
current_date() - interval floor(rand() * 143) day, -- generates random date
current_timestamp() - interval floor(rand() * 10000000) second,
false,
true, 
false,
20
),
(
null,
(select user_id from `User` where username="testeducator"),
(select action_id from `Action` where action_name="Reducing Plastic Waste"),
(select quiz_id from `ActionQuiz` where action_id=(select action_id from `Action` where action_name="Reducing Plastic Waste") LIMIT 1),
200.0,
current_date() - interval floor(rand() * 14) day, -- generates random date
current_timestamp() - interval floor(rand() * 10000) second,
false,
true, 
false,
200
);

INSERT INTO SubmittedActionItem VALUES ('Distance cycled (km)', 1, 5);
INSERT INTO SubmittedActionItem VALUES ('Distance walked (km)', 1, 2);

select * from `User`;
SELECT * FROM `User` 
INNER JOIN `SubmittedAction` ON `User`.user_id = SubmittedAction.user_id 
INNER JOIN `Action` ON `SubmittedAction`.action_id = `Action`.action_id
INNER JOIN `ActionItem` ON `Action`.action_id = `ActionItem`.action_id;



-- delete from `User` where username='teststudent' ;
-- SELECT * FROM `User` JOIN `SubmittedAction` ON `User`.user_id = SubmittedAction.user_id;

update `User` set avatar="example.png" where username="michael";
SELECT `User`.avatar, g_co2_saved FROM `User` JOIN `SubmittedAction` ON `User`.user_id = SubmittedAction.user_id;

select user_id, username, avatar from `User`;

select * from `User` 
INNER JOIN `GroupUser` on `User`.user_id = GroupUser.user_id
INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id; -- gets all groups
-- WHERE `User`.user_id = 3; -- gets all groups for user 3

update `Group` set group_image='example.jpg' where `Group`.group_id = 1;

select * from `User` 
INNER JOIN `GroupUser` on `User`.user_id = GroupUser.user_id
INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id;

select `User`.user_id, `User`.name, SUM(SubmittedAction.g_co2_saved) from `Group`
inner join GroupUser on `Group`.group_id = GroupUser.group_id and `Group`.group_id = 1
inner join `User` on GroupUser.user_id = `User`.user_id
inner join SubmittedAction on `User`.user_id = SubmittedAction.user_id
group by `User`.user_id
order by SUM(SubmittedAction.g_co2_saved) DESC; -- gets a group's co2 leaderboard sorted

select SUM(SubmittedAction.g_co2_saved) from `Group`
inner join GroupUser on `Group`.group_id = GroupUser.group_id and `Group`.group_id = 1
inner join `User` on GroupUser.user_id = `User`.user_id
inner join SubmittedAction on `User`.user_id = SubmittedAction.user_id; -- gets a group's total co2 saved

select SUM(SubmittedAction.g_co2_saved) from `User` -- sum of a user's total co2
inner join SubmittedAction on `User`.user_id = SubmittedAction.user_id and `User`.user_id = 1;

select SUM(SubmittedAction.g_co2_saved) from `User` 
inner join SubmittedAction on `User`.user_id = SubmittedAction.user_id and `User`.user_id = 1
where SubmittedAction.time_submitted between date_sub(now(),INTERVAL 1 WEEK) and now(); -- gets user's total co2 for the last 7 days


select `Group`.group_id from `User`
inner join GroupUser on `User`.user_id = GroupUser.user_id and `User`.user_id=1
INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id
where GroupUser.user_role='owner'; -- group id of groups owned by user

-- all users which are in groups the user owns
select `User`.user_id, `User`.name from `User` 
INNER JOIN `GroupUser` on `User`.user_id = GroupUser.user_id
INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id
where `Group`.group_id in
	(select `Group`.group_id from `User`
	inner join GroupUser on `User`.user_id = GroupUser.user_id and `User`.user_id=1
	INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id
	where GroupUser.user_role='owner')
group by `User`.user_id;

-- all unverified actions from all groups where user is owner
select user_names_in_group, user_id_in_group, sa_id, g_co2_saved, time_submitted, date_of_action from SubmittedAction
INNER JOIN 
	(select `User`.user_id AS user_id_in_group, `User`.name AS user_names_in_group from `User` 
	INNER JOIN `GroupUser` on `User`.user_id = GroupUser.user_id
	INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id
	where `Group`.group_id in
		(select `Group`.group_id from `User`
		inner join GroupUser on `User`.user_id = GroupUser.user_id and `User`.user_id=4
		INNER JOIN `Group` on GroupUser.group_id = `Group`.group_id
		where GroupUser.user_role='owner')
	group by `User`.user_id) sub -- mySQL thing
where SubmittedAction.user_id = user_id_in_group and is_validated = false
order by SubmittedAction.time_submitted ASC;
    
select SUM(SubmittedAction.g_co2_saved) from SubmittedAction;



INSERT INTO `SubmittedAction` ( user_id, action_id, quiz_id, g_co2_saved, date_of_action, first_quiz_answer_correct, quiz_answered, is_validated, points_earned ) VALUES (3, 1, null, 10822.5, '2022-03-25', false, false, false, 1042);

SELECT * FROM `SubmittedAction` WHERE user_id=4 AND action_id=3;

SELECT * from `User`;

SELECT * FROM `ActionItem`;


SELECT SUM(g_co2_saved) AS total_g_co2_saved FROM (SELECT SubmittedAction.g_co2_saved FROM `Group` INNER JOIN `GroupUser` on `Group`.group_id = GroupUser.group_id INNER JOIN `User` on `User`.user_id = GroupUser.user_id inner join SubmittedAction on `User`.user_id = SubmittedAction.user_id and `Group`.group_id = 1 GROUP BY `User`.user_id ) result

;

SELECT SubmittedAction.g_co2_saved FROM `Group` INNER JOIN `GroupUser` on `Group`.group_id = GroupUser.group_id INNER JOIN `User` on `User`.user_id = GroupUser.user_id inner join SubmittedAction on `User`.user_id = SubmittedAction.user_id and `Group`.group_id = 1 GROUP BY `User`.user_id
