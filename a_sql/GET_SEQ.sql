CREATE OR REPLACE FUNCTION GET_SEQ(GRP_NAME VARCHAR(10)) RETURNS INT
BEGIN
    DECLARE RET_SEQ INT;
    DECLARE EXIST BOOLEAN;

    IF (SELECT  COUNT(*)
        FROM    TRV_SEQ
        WHERE   GRP = GRP_NAME) = 0 THEN
            SET EXIST = FALSE;
    ELSE
        SET EXIST = TRUE;
    END IF;

    IF EXIST THEN
        UPDATE TRV_SEQ SET SEQ = SEQ + 1 WHERE GRP = GRP_NAME;
        SET RET_SEQ = (SELECT SEQ FROM TRV_SEQ WHERE GRP = GRP_NAME);
    ELSE
        INSERT INTO TRV_SEQ (GRP, SEQ) VALUES (GRP_NAME, 1);
        SET RET_SEQ = 1;
    END IF;

    RETURN RET_SEQ;
END;