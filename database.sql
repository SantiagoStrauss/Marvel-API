CREATE DATABASE marvel;
USE marvel;
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255),
  telefono VARCHAR(255),
  identificacion VARCHAR(255),
  correo_electronico VARCHAR(255),
  contrasena VARCHAR(255)
);

CREATE TABLE favoritos (
  id_usuario INT,
  id_comic INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
-- crea un alter para hacer que el id_comic no sea una llave foranea
ALTER TABLE favoritos DROP FOREIGN KEY favoritos_ibfk_1;
CREATE TABLE tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(255),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);