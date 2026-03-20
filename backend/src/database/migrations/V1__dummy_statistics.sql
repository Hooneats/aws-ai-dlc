-- 통계 더미 데이터 (최근 30일분)
-- TypeORM synchronize 후 Seed 데이터 생성 이후 실행

-- 이 스크립트는 docker-compose 환경에서 수동 실행하거나
-- SeedService에서 통계 더미 데이터 생성 메서드로 호출

-- 사용법: docker exec -i <mysql-container> mysql -uroot -ppassword table_order < this_file.sql

-- OrderHistory 더미 데이터 (최근 30일, 하루 3~5건)
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS generate_dummy_stats()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE d DATE;
  DECLARE j INT;
  DECLARE daily_count INT;
  DECLARE h_id INT;
  DECLARE t_no INT;
  DECLARE amount INT;

  WHILE i < 30 DO
    SET d = DATE_SUB(CURDATE(), INTERVAL i DAY);
    SET daily_count = 3 + FLOOR(RAND() * 3);
    SET j = 0;

    WHILE j < daily_count DO
      SET t_no = 1 + FLOOR(RAND() * 5);
      SET amount = 15000 + FLOOR(RAND() * 50000);

      INSERT INTO order_history (tableId, sessionId, totalAmount, orderCount, settledAt, createdAt)
      VALUES (t_no, UUID(), amount, 1 + FLOOR(RAND() * 3), TIMESTAMP(d, SEC_TO_TIME(36000 + FLOOR(RAND() * 36000))), TIMESTAMP(d, SEC_TO_TIME(36000 + FLOOR(RAND() * 28800))));

      SET h_id = LAST_INSERT_ID();

      INSERT INTO order_history_item (historyId, orderId, status, totalAmount, memo, items, orderedAt)
      VALUES (h_id, h_id, 'COMPLETED', amount, NULL,
        JSON_ARRAY(
          JSON_OBJECT('menuName', ELT(1 + FLOOR(RAND() * 5), '김치찌개', '된장찌개', '비빔밥', '불고기', '냉면'),
                      'quantity', 1 + FLOOR(RAND() * 3), 'unitPrice', 8000 + FLOOR(RAND() * 7000),
                      'originalPrice', 10000 + FLOOR(RAND() * 5000), 'discountRate', 0)
        ),
        TIMESTAMP(d, SEC_TO_TIME(36000 + FLOOR(RAND() * 28800))));

      SET j = j + 1;
    END WHILE;

    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;

CALL generate_dummy_stats();
DROP PROCEDURE IF EXISTS generate_dummy_stats;
