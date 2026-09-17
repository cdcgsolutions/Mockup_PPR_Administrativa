-- =================================================================================
-- BD: RNDS | ESQUEMA: PPR (Prácticas Profesionales)
-- UNIVERSIDAD PRIVADA DOMINGO SAVIO (UPDS) - MÓDULO SAADS
-- Naming Convention: PascalCase / Atributos y Variables en Español
-- =================================================================================

USE [RNDS];
GO

-- 1. CREACIÓN DEL ESQUEMA PPR
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'PPR')
BEGIN
    EXEC('CREATE SCHEMA [PPR];');
    PRINT 'Esquema [PPR] creado exitosamente.';
END
GO

-- =================================================================================
-- 2. TABLAS CATÁLOGOS / MAESTRAS
-- =================================================================================

-- Tabla: PPR.EstadoSolicitud
IF OBJECT_ID(N'PPR.EstadoSolicitud', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.EstadoSolicitud (
        IdEstadoSolicitud INT IDENTITY(1,1) NOT NULL,
        Nombre NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(250) NULL,
        Activo BIT NOT NULL CONSTRAINT DF_EstadoSolicitud_Activo DEFAULT (1),
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_EstadoSolicitud_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_EstadoSolicitud PRIMARY KEY CLUSTERED (IdEstadoSolicitud ASC)
    );
    PRINT 'Tabla PPR.EstadoSolicitud creada.';
END
GO

-- Tabla: PPR.EstadoPractica
IF OBJECT_ID(N'PPR.EstadoPractica', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.EstadoPractica (
        IdEstadoPractica INT IDENTITY(1,1) NOT NULL,
        Nombre NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(250) NULL,
        Activo BIT NOT NULL CONSTRAINT DF_EstadoPractica_Activo DEFAULT (1),
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_EstadoPractica_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_EstadoPractica PRIMARY KEY CLUSTERED (IdEstadoPractica ASC)
    );
    PRINT 'Tabla PPR.EstadoPractica creada.';
END
GO

-- Tabla: PPR.TipoDocumento
IF OBJECT_ID(N'PPR.TipoDocumento', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.TipoDocumento (
        IdTipoDocumento INT IDENTITY(1,1) NOT NULL,
        Nombre NVARCHAR(150) NOT NULL,
        EsObligatorio BIT NOT NULL CONSTRAINT DF_TipoDocumento_EsObligatorio DEFAULT (1),
        Activo BIT NOT NULL CONSTRAINT DF_TipoDocumento_Activo DEFAULT (1),
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_TipoDocumento_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_TipoDocumento PRIMARY KEY CLUSTERED (IdTipoDocumento ASC)
    );
    PRINT 'Tabla PPR.TipoDocumento creada.';
END
GO

-- =================================================================================
-- 3. TABLAS DE CONVENIOS Y SOLICITUDES
-- =================================================================================

-- Tabla: PPR.PracticaConvenio
IF OBJECT_ID(N'PPR.PracticaConvenio', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.PracticaConvenio (
        IdPracticaConvenio INT IDENTITY(1,1) NOT NULL,
        NroConvenio NVARCHAR(50) NOT NULL,
        IdMateria INT NOT NULL,
        HorasTotales INT NOT NULL CONSTRAINT DF_PracticaConvenio_HorasTotales DEFAULT (360),
        CuposOfertados INT NOT NULL CONSTRAINT DF_PracticaConvenio_CuposOfertados DEFAULT (0),
        CuposDisponibles INT NOT NULL CONSTRAINT DF_PracticaConvenio_CuposDisponibles DEFAULT (0),
        FechaInicio DATE NULL,
        FechaFin DATE NULL,
        AreaPractica NVARCHAR(200) NULL,
        Activo BIT NOT NULL CONSTRAINT DF_PracticaConvenio_Activo DEFAULT (1),
        IdUsuarioRegistro INT NOT NULL,
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_PracticaConvenio_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_PracticaConvenio PRIMARY KEY CLUSTERED (IdPracticaConvenio ASC)
    );
    PRINT 'Tabla PPR.PracticaConvenio creada.';
END
GO

-- Tabla: PPR.Solicitud
IF OBJECT_ID(N'PPR.Solicitud', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.Solicitud (
        IdSolicitud INT IDENTITY(1,1) NOT NULL,
        IdInscripcionCarrera INT NOT NULL,
        IdTipoMateria INT NOT NULL,
        IdMateria INT NOT NULL,
        IdPracticaConvenio INT NULL, -- Nulo si es empresa sugerida por estudiante
        IdUsuario INT NOT NULL,
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_Solicitud_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_Solicitud PRIMARY KEY CLUSTERED (IdSolicitud ASC),
        CONSTRAINT FK_Solicitud_PracticaConvenio FOREIGN KEY (IdPracticaConvenio) REFERENCES PPR.PracticaConvenio (IdPracticaConvenio)
    );
    PRINT 'Tabla PPR.Solicitud creada.';
END
GO

-- Tabla: PPR.SolicitudEmpresa
IF OBJECT_ID(N'PPR.SolicitudEmpresa', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.SolicitudEmpresa (
        IdSolicitudEmpresa INT IDENTITY(1,1) NOT NULL,
        IdSolicitud INT NOT NULL,
        Nit NVARCHAR(50) NULL,
        NombreEmpresa NVARCHAR(200) NOT NULL,
        Telefono NVARCHAR(50) NULL,
        Direccion NVARCHAR(250) NULL,
        CorreoElectronico NVARCHAR(150) NULL,
        Supervisor NVARCHAR(150) NULL,
        AreaPractica NVARCHAR(200) NULL,
        CONSTRAINT PK_SolicitudEmpresa PRIMARY KEY CLUSTERED (IdSolicitudEmpresa ASC),
        CONSTRAINT FK_SolicitudEmpresa_Solicitud FOREIGN KEY (IdSolicitud) REFERENCES PPR.Solicitud (IdSolicitud) ON DELETE CASCADE
    );
    PRINT 'Tabla PPR.SolicitudEmpresa creada.';
END
GO

-- Tabla: PPR.SolicitudAprobacion
IF OBJECT_ID(N'PPR.SolicitudAprobacion', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.SolicitudAprobacion (
        IdSolicitudAprobacion INT IDENTITY(1,1) NOT NULL,
        IdSolicitud INT NOT NULL,
        IdEstadoSolicitud INT NOT NULL,
        Observaciones NVARCHAR(MAX) NULL,
        Fecha DATETIME NOT NULL CONSTRAINT DF_SolicitudAprobacion_Fecha DEFAULT (GETDATE()),
        FechaActualizacion DATETIME NULL,
        CONSTRAINT PK_SolicitudAprobacion PRIMARY KEY CLUSTERED (IdSolicitudAprobacion ASC),
        CONSTRAINT FK_SolicitudAprobacion_Solicitud FOREIGN KEY (IdSolicitud) REFERENCES PPR.Solicitud (IdSolicitud),
        CONSTRAINT FK_SolicitudAprobacion_EstadoSolicitud FOREIGN KEY (IdEstadoSolicitud) REFERENCES PPR.EstadoSolicitud (IdEstadoSolicitud)
    );
    PRINT 'Tabla PPR.SolicitudAprobacion creada.';
END
GO

-- =================================================================================
-- 4. TABLAS DE PRÁCTICA Y SEGUIMIENTO ACADÉMICO
-- =================================================================================

-- Tabla: PPR.Practica
IF OBJECT_ID(N'PPR.Practica', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.Practica (
        IdPractica INT IDENTITY(1,1) NOT NULL,
        IdSolicitud INT NOT NULL,
        IdInscripcionCarrera INT NOT NULL,
        IdTipoMateria INT NOT NULL,
        IdMateria INT NOT NULL,
        IdPracticaConvenio INT NULL,
        IdEstadoPractica INT NOT NULL,
        IdDocente INT NULL, -- Docente Tutor/Supervisador asignado
        FechaInicio DATE NULL,
        FechaFin DATE NULL,
        TotalHoras INT NOT NULL CONSTRAINT DF_Practica_TotalHoras DEFAULT (360),
        Nota DECIMAL(5,2) NULL,
        IdOrdenCobro BIGINT NULL,
        IdOferta INT NULL,
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_Practica_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_Practica PRIMARY KEY CLUSTERED (IdPractica ASC),
        CONSTRAINT FK_Practica_Solicitud FOREIGN KEY (IdSolicitud) REFERENCES PPR.Solicitud (IdSolicitud),
        CONSTRAINT FK_Practica_PracticaConvenio FOREIGN KEY (IdPracticaConvenio) REFERENCES PPR.PracticaConvenio (IdPracticaConvenio),
        CONSTRAINT FK_Practica_EstadoPractica FOREIGN KEY (IdEstadoPractica) REFERENCES PPR.EstadoPractica (IdEstadoPractica)
    );
    PRINT 'Tabla PPR.Practica creada.';
END
GO

-- Tabla: PPR.PracticaEmpresa
IF OBJECT_ID(N'PPR.PracticaEmpresa', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.PracticaEmpresa (
        IdPracticaEmpresa INT IDENTITY(1,1) NOT NULL,
        IdPractica INT NOT NULL,
        NroConvenio NVARCHAR(50) NULL,
        NombreEmpresa NVARCHAR(200) NOT NULL,
        Supervisor NVARCHAR(150) NULL,
        CargoSupervisor NVARCHAR(150) NULL,
        AreaPractica NVARCHAR(200) NULL,
        Turno NVARCHAR(50) NULL,
        CONSTRAINT PK_PracticaEmpresa PRIMARY KEY CLUSTERED (IdPracticaEmpresa ASC),
        CONSTRAINT FK_PracticaEmpresa_Practica FOREIGN KEY (IdPractica) REFERENCES PPR.Practica (IdPractica) ON DELETE CASCADE
    );
    PRINT 'Tabla PPR.PracticaEmpresa creada.';
END
GO

-- Tabla: PPR.PracticaEvaluacion
IF OBJECT_ID(N'PPR.PracticaEvaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.PracticaEvaluacion (
        IdPracticaEvaluacion INT IDENTITY(1,1) NOT NULL,
        IdPractica INT NOT NULL,
        IdAspectoEvaluacion INT NOT NULL,
        Nota DECIMAL(5,2) NOT NULL,
        Observaciones NVARCHAR(MAX) NULL,
        Fecha DATETIME NOT NULL CONSTRAINT DF_PracticaEvaluacion_Fecha DEFAULT (GETDATE()),
        CONSTRAINT PK_PracticaEvaluacion PRIMARY KEY CLUSTERED (IdPracticaEvaluacion ASC),
        CONSTRAINT FK_PracticaEvaluacion_Practica FOREIGN KEY (IdPractica) REFERENCES PPR.Practica (IdPractica)
    );
    PRINT 'Tabla PPR.PracticaEvaluacion creada.';
END
GO

-- Tabla: PPR.PracticaDocumento
IF OBJECT_ID(N'PPR.PracticaDocumento', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.PracticaDocumento (
        IdPracticaDocumento INT IDENTITY(1,1) NOT NULL,
        IdPractica INT NOT NULL,
        IdTipoDocumento INT NOT NULL,
        NombreArchivo NVARCHAR(250) NOT NULL,
        RutaArchivo NVARCHAR(500) NOT NULL,
        FechaCarga DATETIME NOT NULL CONSTRAINT DF_PracticaDocumento_FechaCarga DEFAULT (GETDATE()),
        IdUsuario INT NOT NULL,
        CONSTRAINT PK_PracticaDocumento PRIMARY KEY CLUSTERED (IdPracticaDocumento ASC),
        CONSTRAINT FK_PracticaDocumento_Practica FOREIGN KEY (IdPractica) REFERENCES PPR.Practica (IdPractica),
        CONSTRAINT FK_PracticaDocumento_TipoDocumento FOREIGN KEY (IdTipoDocumento) REFERENCES PPR.TipoDocumento (IdTipoDocumento)
    );
    PRINT 'Tabla PPR.PracticaDocumento creada.';
END
GO

-- Tabla: PPR.PracticaRegistro
IF OBJECT_ID(N'PPR.PracticaRegistro', N'U') IS NULL
BEGIN
    CREATE TABLE PPR.PracticaRegistro (
        IdPracticaRegistro INT IDENTITY(1,1) NOT NULL,
        IdPractica INT NOT NULL,
        IdRegistroMateria BIGINT NOT NULL,
        FechaRegistro DATETIME NOT NULL CONSTRAINT DF_PracticaRegistro_FechaRegistro DEFAULT (GETDATE()),
        CONSTRAINT PK_PracticaRegistro PRIMARY KEY CLUSTERED (IdPracticaRegistro ASC),
        CONSTRAINT FK_PracticaRegistro_Practica FOREIGN KEY (IdPractica) REFERENCES PPR.Practica (IdPractica)
    );
    PRINT 'Tabla PPR.PracticaRegistro creada.';
END
GO

-- =================================================================================
-- 5. ÍNDICES DE RENDIMIENTO (FOREIGN KEYS)
-- =================================================================================

CREATE NONCLUSTERED INDEX IX_Solicitud_IdInscripcionCarrera ON PPR.Solicitud(IdInscripcionCarrera);
CREATE NONCLUSTERED INDEX IX_Solicitud_IdPracticaConvenio ON PPR.Solicitud(IdPracticaConvenio);

CREATE NONCLUSTERED INDEX IX_SolicitudAprobacion_IdSolicitud ON PPR.SolicitudAprobacion(IdSolicitud);
CREATE NONCLUSTERED INDEX IX_SolicitudAprobacion_IdEstadoSolicitud ON PPR.SolicitudAprobacion(IdEstadoSolicitud);

CREATE NONCLUSTERED INDEX IX_Practica_IdSolicitud ON PPR.Practica(IdSolicitud);
CREATE NONCLUSTERED INDEX IX_Practica_IdInscripcionCarrera ON PPR.Practica(IdInscripcionCarrera);
CREATE NONCLUSTERED INDEX IX_Practica_IdEstadoPractica ON PPR.Practica(IdEstadoPractica);
CREATE NONCLUSTERED INDEX IX_Practica_IdDocente ON PPR.Practica(IdDocente);

CREATE NONCLUSTERED INDEX IX_PracticaDocumento_IdPractica ON PPR.PracticaDocumento(IdPractica);
CREATE NONCLUSTERED INDEX IX_PracticaDocumento_IdTipoDocumento ON PPR.PracticaDocumento(IdTipoDocumento);

CREATE NONCLUSTERED INDEX IX_PracticaEvaluacion_IdPractica ON PPR.PracticaEvaluacion(IdPractica);

GO

-- =================================================================================
-- 6. DATOS DE INSERCIÓN INICIAL (SEED DATA)
-- =================================================================================

-- Insertar Estados de Solicitud
IF NOT EXISTS (SELECT 1 FROM PPR.EstadoSolicitud)
BEGIN
    INSERT INTO PPR.EstadoSolicitud (Nombre, Descripcion) VALUES 
    (N'REGISTRADA', N'Solicitud registrada por el estudiante'),
    (N'EN_REVISION', N'En revisión por Dirección de Carrera'),
    (N'OBSERVADA', N'Solicitud observada con correcciones requeridas'),
    (N'APROBADA', N'Solicitud aprobada y orden de cobro generada'),
    (N'RECHAZADA', N'Solicitud denegada por no cumplir requisitos');
    PRINT 'Datos iniciales insertados en PPR.EstadoSolicitud.';
END
GO

-- Insertar Estados de Práctica
IF NOT EXISTS (SELECT 1 FROM PPR.EstadoPractica)
BEGIN
    INSERT INTO PPR.EstadoPractica (Nombre, Descripcion) VALUES 
    (N'PENDIENTE_PAGO', N'Esperando pago de orden de cobro'),
    (N'EN_CURSO', N'Práctica profesional en desarrollo (360 hrs)'),
    (N'EN_EVALUACION', N'Informe y documentación entregada, en revisión'),
    (N'ACREDITADA', N'Práctica aprobada y nota registrada en kardex'),
    (N'REPROBADA', N'Práctica reprobada o abandonada');
    PRINT 'Datos iniciales insertados en PPR.EstadoPractica.';
END
GO

-- Insertar Tipos de Documentos
IF NOT EXISTS (SELECT 1 FROM PPR.TipoDocumento)
BEGIN
    INSERT INTO PPR.TipoDocumento (Nombre, EsObligatorio) VALUES 
    (N'Formulario de Apertura de Práctica', 1),
    (N'Carta de Presentación Firmada', 1),
    (N'Informe Inicial de Actividades', 1),
    (N'Evaluación Desempeño Empresarial', 1),
    (N'Informe Final de Práctica Profesional', 1);
    PRINT 'Datos iniciales insertados en PPR.TipoDocumento.';
END
GO

PRINT '=================================================================';
PRINT ' SCRIPT DE BASE DE DATOS PPR COMPLETO Y EJECUTADO CON ÉXITO.';
PRINT '=================================================================';
GO
