CREATE DATABASE ShangaiExpedition;
USE ShangaiExpedition;

-- Tabela de usuários
CREATE TABLE Users
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)         NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(100)        NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin   BOOLEAN  DEFAULT FALSE,
    token      VARCHAR(255)
);

-- Distritos
CREATE TABLE Districts
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Categorias de pontos turísticos
CREATE TABLE Categories
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tipos de eventos
CREATE TABLE EventTypes
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Pontos turísticos
CREATE TABLE TourismSpots
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    latitude    DECIMAL(10, 7),
    longitude   DECIMAL(10, 7),
    district_id INT          NOT NULL,
    category_id INT          NOT NULL,
    access_link VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  INT          NOT NULL,
    updated_by  INT          NOT NULL,
    FOREIGN KEY (district_id) REFERENCES Districts (id),
    FOREIGN KEY (category_id) REFERENCES Categories (id),
    FOREIGN KEY (created_by) REFERENCES Users (id),
    FOREIGN KEY (updated_by) REFERENCES Users (id)
);

-- Imagens de pontos turísticos
CREATE TABLE TourismSpotsImages
(
    id               INT AUTO_INCREMENT PRIMARY KEY,
    path             VARCHAR(255) NOT NULL,
    tourism_spots_id INT          NOT NULL,
    FOREIGN KEY (tourism_spots_id) REFERENCES TourismSpots (id)
);

-- Eventos
CREATE TABLE Events
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    date            DATE         NOT NULL,
    start_time      TIME         NOT NULL,
    end_time        TIME         NOT NULL,
    type_id         INT          NOT NULL,
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    district_id     INT          NOT NULL,
    access_link     VARCHAR(255),
    people_quantity INT      DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      INT          NOT NULL,
    updated_by      INT          NOT NULL,
    FOREIGN KEY (type_id) REFERENCES EventTypes (id),
    FOREIGN KEY (district_id) REFERENCES Districts (id),
    FOREIGN KEY (created_by) REFERENCES Users (id),
    FOREIGN KEY (updated_by) REFERENCES Users (id)
);

-- Reviews
CREATE TABLE Reviews
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT  NOT NULL,
    event_id        INT,
    tourism_spot_id INT,
    created_at      DATE NOT NULL,
    review           INT,
    FOREIGN KEY (user_id) REFERENCES Users (id),
    FOREIGN KEY (event_id) REFERENCES Events (id),
    FOREIGN KEY (tourism_spot_id) REFERENCES TourismSpots (id)
);

-- Inserts de dados base
INSERT INTO Districts (name)
VALUES ('Huangpu'),
       ('Xuhui'),
       ('Changning'),
       ('Jing\'an'),
       ('Putuo'),
       ('Zhabei'),
       ('Hongkou'),
       ('Yangpu'),
       ('Baoshan'),
       ('Minhang'),
       ('Jiading'),
       ('Pudong New Area'),
       ('Jinshan'),
       ('Songjiang'),
       ('Qingpu'),
       ('Fengxian'),
       ('Chongming');

INSERT INTO Categories (name)
VALUES ('Museu'),
       ('Parque'),
       ('Templo'),
       ('Galeria de Arte'),
       ('Centro Financeiro');

INSERT INTO EventTypes (name)
VALUES ('Chinese New Year'),
       ('Shanghai Fashion Week'),
       ('Film Festival'),
       ('Trade Fair'),
       ('Music Festival'),
       ('Cultural Exhibition');

INSERT INTO Users (username, email, password, is_admin)
VALUES ('administrador um', 'administrador@email.com', 'administrador', TRUE),
       ('administrador dois', 'administrador2@email.com', 'administrador', TRUE),
       ('usuario um', 'comum@email.com', 'comum', FALSE),
       ('usuario dois', 'comum2@email.com', 'comum', FALSE);

-- Pontos turísticos
INSERT INTO TourismSpots
(name, description, latitude, longitude, district_id, category_id, access_link, created_by, updated_by)
VALUES ('Bund', 'Largo histórico à beira do rio Huangpu', 31.2400, 121.4900, 1, 2,  '', 1, 1),
       ('Templo Jing\'an', 'Templo budista no distrito Jing\'an', 31.2243, 121.4580, 4, 3, '', 1, 1),
       ('Museu de Xangai', 'Museu de história e arte', 31.2286, 121.4740, 1, 1,  '', 1, 1);

-- Eventos
INSERT INTO Events
(name, description, date, start_time, end_time, type_id, latitude, longitude, district_id, access_link, people_quantity,
 created_by, updated_by)
VALUES ('Ano Novo Chinês', 'Celebração do Ano Novo Lunar', CURDATE(), '10:00:00', '23:00:00', 1, 31.2300, 121.4730, 1,
        '', 1000, 1, 1),
       ('Shanghai Fashion Week', 'Semana de moda internacional', CURDATE() + INTERVAL 30 DAY, '09:00:00', '21:00:00', 2,
        31.2300, 121.4800, 12, '', 500, 1, 1);
