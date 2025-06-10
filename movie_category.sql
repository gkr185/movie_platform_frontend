-- 创建电影-分类关联表
CREATE TABLE `movie_category` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
  `movie_id` INT UNSIGNED NOT NULL COMMENT '电影ID',
  `category_id` INT UNSIGNED NOT NULL COMMENT '分类ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `idx_movie_category` (`movie_id`, `category_id`),
  FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电影-分类关联表';

-- 插入示例数据
INSERT INTO `movie_category` (`movie_id`, `category_id`) VALUES
(1, 1),   -- 假设电影ID=1关联到动作类型(category_id=1)
(1, 3),   -- 同一部电影也可以是科幻类型(category_id=3)
(2, 2),   -- 电影ID=2是喜剧类型(category_id=2)
(3, 4);   -- 电影ID=3是恐怖类型(category_id=4) 