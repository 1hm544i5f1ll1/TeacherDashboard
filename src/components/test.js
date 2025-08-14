-- ==== SCALE ====
SET @USERS := 20000;           -- rows in users
SET @SESS_PER_USER := 5;       -- avg sessions per user
SET @EVT_PER_SESS := 300;      -- avg events per session
SET SESSION cte_max_recursion_depth = 1000; -- for 0..999 seed

-- ==== FAST LOAD SETTINGS ====
SET UNIQUE_CHECKS=0; SET FOREIGN_KEY_CHECKS=0; SET AUTOCOMMIT=0;

-- ==== 0..999 SEED ====
WITH RECURSIVE seq(n) AS ( SELECT 0 UNION ALL SELECT n+1 FROM seq WHERE n<999 )
SELECT 1; -- materialize CTE once

-- Build helper tables (persist for cross joins)
DROP TEMPORARY TABLE IF EXISTS seq_1k;
CREATE TEMPORARY TABLE seq_1k (n INT PRIMARY KEY) ENGINE=MEMORY
AS WITH RECURSIVE seq(n) AS (SELECT 0 UNION ALL SELECT n+1 FROM seq WHERE n<999) SELECT n FROM seq;

-- Cross-join to get up to 1e6 rows on demand
DROP TEMPORARY TABLE IF EXISTS seq_1m;
CREATE TEMPORARY TABLE seq_1m (n INT PRIMARY KEY) ENGINE=MEMORY
AS SELECT a.n + b.n*1000 AS n FROM seq_1k a JOIN seq_1k b;

-- ==== USERS ====
INSERT INTO users (user_id, role, created_at)
SELECT
  UUID(),
  ELT(1+FLOOR(RAND()*3), 'user','moderator','admin'),
  NOW() - INTERVAL FLOOR(RAND()*30) DAY
FROM seq_1m
WHERE n < @USERS;

-- Index for join speed (optional if already exists)
-- ALTER TABLE users ADD PRIMARY KEY (user_id); -- if not already

-- ==== SESSIONS ====
-- Create a temp list of users to assign sessions evenly
DROP TEMPORARY TABLE IF EXISTS _u;
CREATE TEMPORARY TABLE _u (rn INT AUTO_INCREMENT PRIMARY KEY, user_id CHAR(36))
SELECT user_id FROM users ORDER BY created_at;

-- Session rows = @USERS * @SESS_PER_USER
DROP TEMPORARY TABLE IF EXISTS _sess_gen;
CREATE TEMPORARY TABLE _sess_gen (
  session_id CHAR(36) PRIMARY KEY,
  user_id    CHAR(36),
  started_at DATETIME,
  ended_at   DATETIME,
  entry_url  VARCHAR(1024),
  referrer   VARCHAR(1024),
  user_agent VARCHAR(512),
  ip_hash    CHAR(64)
) ENGINE=InnoDB;

INSERT INTO _sess_gen
SELECT
  UUID(),
  u.user_id,
  ts AS started_at,
  IF(RAND()<0.85, ts + INTERVAL (30 + FLOOR(RAND()*7200)) SECOND, NULL) AS ended_at,
  CONCAT('https://example.com/', ELT(1+FLOOR(RAND()*5),'home','docs','pricing','blog','dashboard')) AS entry_url,
  IF(RAND()<0.6, ELT(1+FLOOR(RAND()*4),'https://google.com','https://bing.com','https://twitter.com',NULL), NULL) AS referrer,
  ELT(1+FLOOR(RAND()*4),'Mozilla/5.0','Chrome/120.0','Safari/17.0','Edge/120.0') AS user_agent,
  UPPER(SHA2(UUID(),256)) AS ip_hash
FROM (
  SELECT
    u.user_id,
    -- spread sessions over last 21 days at random hours
    NOW() - INTERVAL FLOOR(RAND()*21) DAY - INTERVAL FLOOR(RAND()*86400) SECOND AS ts
  FROM _u u
  JOIN seq_1k s ON s.n < @SESS_PER_USER
) AS u;

INSERT INTO sessions (session_id,user_id,started_at,ended_at,entry_url,referrer,user_agent,ip_hash)
SELECT * FROM _sess_gen;

-- ==== EVENTS ====
-- For speed, pre-list sessions
DROP TEMPORARY TABLE IF EXISTS _s;
CREATE TEMPORARY TABLE _s (rn INT AUTO_INCREMENT PRIMARY KEY, session_id CHAR(36), user_id CHAR(36), started_at DATETIME)
SELECT session_id, user_id, started_at FROM sessions;

-- Generate events per session by joining a sequence
-- This creates @EVT_PER_SESS events per session; adjust scale vars above
INSERT INTO events
(event_id, session_id, user_id, ts, type, url, duration_ms, props, scroll_pct, action, elem_ref, x, y, media_pos_ms, zoom_pct, downloaded)
SELECT
  UUID(),
  s.session_id,
  IF(RAND()<0.95, s.user_id, NULL) AS user_id,
  s.started_at + INTERVAL (FLOOR(RAND()*7200)) SECOND AS ts, -- within ~2h of session start
  ELT(1+FLOOR(RAND()*7),'pageview','click','scroll','play','pause','download','custom') AS type,
  CONCAT('https://example.com/', ELT(1+FLOOR(RAND()*6),'home','docs','post/', 'report.pdf','video','product/', 'pricing')) AS url,
  50 + FLOOR(RAND()*5000) AS duration_ms,
  JSON_OBJECT(
    'ab', ELT(1+FLOOR(RAND()*3),'A','B','C'),
    'uidx', FLOOR(RAND()*1000),
    'tag', ELT(1+FLOOR(RAND()*5),'div','a','button','video','canvas')
  ) AS props,
  IF(RAND()<0.6, FLOOR(RAND()*100), NULL) AS scroll_pct,
  IF(RAND()<0.5, ELT(1+FLOOR(RAND()*3),'click','hover','submit'), NULL) AS action,
  IF(RAND()<0.5, CONCAT(ELT(1+FLOOR(RAND()*3),'signup','buy','play'), '-btn'), NULL) AS elem_ref,
  IF(RAND()<0.4, FLOOR(RAND()*1200), NULL) AS x,
  IF(RAND()<0.4, FLOOR(RAND()*800), NULL)  AS y,
  IF(RAND()<0.3, FLOOR(RAND()*600000), NULL) AS media_pos_ms,
  IF(RAND()<0.2, FLOOR(RAND()*200), NULL)  AS zoom_pct,
  IF(RAND()<0.1, 1, 0) AS downloaded
FROM _s s
JOIN seq_1k e ON e.n < @EVT_PER_SESS;

-- ==== CLEANUP / COMMIT ====
COMMIT;
SET UNIQUE_CHECKS=1; SET FOREIGN_KEY_CHECKS=1; SET AUTOCOMMIT=1;

-- Quick counts
SELECT 
  (SELECT COUNT(*) FROM users)    AS users,
  (SELECT COUNT(*) FROM sessions) AS sessions,
  (SELECT COUNT(*) FROM events)   AS events;
