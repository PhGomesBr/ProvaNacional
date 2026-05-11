create database moduloF;
use moduloF;


create table proprietario(
    id_proprietario int primary key auto_increment not null,
    nome varchar(255) not null, 
    celular varchar(14) not null,
    email varchar(100) not null 
);
create table endereco(
id_endereco int primary key auto_increment not null,
logradouro varchar(150) not null, 
numero varchar(20) not null, 
complemento varchar(50) not null,
bairro varchar(50) not null,
cidade varchar(50) not null, 
estado varchar(50) not null, 
cep varchar(10) not null
);
create table empresa (
    id_empresa int primary key auto_increment not null,
    nome_empresa varchar(255) not null,
    telefone varchar(14) not null,
    email varchar(100) not null,
    ativo boolean default true, -- REQUISITO: Para saber se está desativada
    fk_proprietario INT not null,
    fk_endereco int not null,
    foreign key (fk_endereco) references endereco(id_endereco),
    FOREIGN KEY (fk_proprietario) REFERENCES proprietario(id_proprietario)
);
create table contato(
    id_contato int primary key auto_increment not null,
    nome varchar(100) not null,
    celular varchar(14) not null,
    email varchar(100) not null,
    fk_empresa int not null,
    foreign key (fk_empresa) references empresa(id_empresa)
);

create table produtos (
    id_produto int primary key auto_increment not null,
    gtin varchar(14) unique not null, 
    nome_en varchar(255) not null,   
    nome_fr varchar(255) not null,   
    descricao_en text,               
    descricao_fr text,               
    marca varchar(100),
    pais_origem varchar(100),
    peso_bruto decimal(10,3),
    peso_liquido decimal(10,3),
    unidade_peso varchar(10),        -- Ex: kg, g
    imagem_url varchar(255),         -- Para o envio de imagens
    oculto boolean default false,    -- REQUISITO: Para ocultar produtos
    fk_empresa int not null,
    foreign key (fk_empresa) references empresa(id_empresa)
);
