START TRANSACTION;

CREATE PROCEDURE selectallbody()
BEGIN
    SELECT * FROM body ORDER BY id DESC;
END;

CREATE PROCEDURE selectjoin(IN table1 VARCHAR(255), IN table2 VARCHAR(255))
BEGIN
    SELECT t1.column1, t2.column2
    FROM table1 t1
    JOIN table2 t2 ON t1.id = t2.id;
END;

CREATE TRIGGER updatetigger
BEFORE UPDATE ON body
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = `body` AND column_name = `date_update`) THEN
        ALTER TABLE body ADD date_update DATETIME;
    END IF;
    SET NEW.date_update = NOW();
END;

COMMIT;