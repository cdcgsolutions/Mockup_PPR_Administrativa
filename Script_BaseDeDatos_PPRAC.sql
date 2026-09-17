-- =================================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - MÓDULO DE PRÁCTICAS PROFESIONALES (PPRAC)
-- UNIVERSIDAD PRIVADA DOMINGO SAVIO (SAADS)
-- Estándar: Nombres en PascalCase y Atributos en Español
-- =================================================================================

USE [master];
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SAADS_PPRAC')
BEGIN
    CREATE DATABASE [SAADS_PPRAC];
END
GO

USE [SAADS_PPRAC];
GO

-- =================================================================================
-- 1. TABLAS DE CATÁLOGO Y CONFIGURACIÓN BASE
-- =================================================================================

-- Catálogo de Estados de la Solicitud (e.g., Registrada, En Revisión, Observada, Aprobada)
IF OBJECT_ID('dbo.EstadoSolicitud', 'U') IS NOT NULL DROP TABLE dbo.EstadoSolicitud;
CREATE TABLE dbo.EstadoSolicitud (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Nombre] VARCHAR(100) NOT NULL,
    [Descripcion] VARCHAR(255) NULL,
    [Activo] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_EstadoSolicitud] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Catálogo de Estados de la Práctica (e.g., En Curso, En Evaluación, Concluida, Acreditada)
IF OBJECT_ID('dbo.EstadoPractica', 'U') IS NOT NULL DROP TABLE dbo.EstadoPractica;
CREATE TABLE dbo.EstadoPractica (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Nombre] VARCHAR(100) NOT NULL,
    [Descripcion] VARCHAR(255) NULL,
    [Activo] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_EstadoPractica] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Catálogo de Tipos de Documentos Académicos (Formulario Apertura, Informe Final, Carta Presentación)
IF OBJECT_ID('dbo.TipoDocumento', 'U') IS NOT NULL DROP TABLE dbo.TipoDocumento;
CREATE TABLE dbo.TipoDocumento (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Nombre] VARCHAR(100) NOT NULL,
    [Obligatorio] BIT NOT NULL DEFAULT 1,
    [Activo] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_TipoDocumento] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- =================================================================================
-- 2. TABLA DE CONVENIOS DE PRÁCTICAS PROFESIONALES
-- =================================================================================

-- Oferta de plazas institucionales y convenios empresariales activos
IF OBJECT_ID('dbo.PracticaConvenio', 'U') IS NOT NULL DROP TABLE dbo.PracticaConvenio;
CREATE TABLE dbo.PracticaConvenio (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [NroConvenio] VARCHAR(50) NOT NULL,
    [IdMateria] INT NOT NULL,
    [HorasTotales] INT NOT NULL DEFAULT 360,
    [CuposOfertados] INT NOT NULL,
    [CuposDisponibles] INT NOT NULL,
    [FechaInicio] DATE NULL,
    [FechaFin] DATE NULL,
    [AreaPractica] VARCHAR(150) NULL,
    [Activo] BIT NOT NULL DEFAULT 1,
    [IdUsuario] INT NOT NULL,
    CONSTRAINT [PK_PracticaConvenio] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- =================================================================================
-- 3. DOMINIO DE SOLICITUDES Y TRÁMITE INICIAL
-- =================================================================================

-- Solicitud de prácticas realizada por el estudiante en el portal
IF OBJECT_ID('dbo.Solicitud', 'U') IS NOT NULL DROP TABLE dbo.Solicitud;
CREATE TABLE dbo.Solicitud (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdInscripcionCarrera] INT NOT NULL,
    [IdTipoMateria] INT NOT NULL,
    [IdMateria] INT NOT NULL,
    [IdPracticaConvenio] INT NULL, -- NULL si el estudiante propone su propia empresa
    [IdUsuario] INT NOT NULL,
    [FechaCreacion] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Solicitud] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Solicitud_PracticaConvenio] FOREIGN KEY ([IdPracticaConvenio]) REFERENCES dbo.PracticaConvenio ([Id])
);
GO

-- Detalle de empresa externa propuesta por el estudiante (Si IdPracticaConvenio es NULL)
IF OBJECT_ID('dbo.SolicitudEmpresa', 'U') IS NOT NULL DROP TABLE dbo.SolicitudEmpresa;
CREATE TABLE dbo.SolicitudEmpresa (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdSolicitud] INT NOT NULL,
    [Nit] VARCHAR(20) NULL,
    [NombreEmpresa] VARCHAR(200) NOT NULL,
    [Telefono] VARCHAR(50) NULL,
    [Direccion] VARCHAR(255) NULL,
    [CorreoElectronico] VARCHAR(150) NULL,
    [Supervisor] VARCHAR(150) NULL,
    [AreaPractica] VARCHAR(150) NULL,
    CONSTRAINT [PK_SolicitudEmpresa] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_SolicitudEmpresa_Solicitud] FOREIGN KEY ([IdSolicitud]) REFERENCES dbo.Solicitud ([Id]) ON DELETE CASCADE
);
GO

-- Historial de aprobaciones, observaciones y seguimiento de la Dirección de Carrera
IF OBJECT_ID('dbo.SolicitudAprobacion', 'U') IS NOT NULL DROP TABLE dbo.SolicitudAprobacion;
CREATE TABLE dbo.SolicitudAprobacion (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdSolicitud] INT NOT NULL,
    [IdEstadoSolicitud] INT NOT NULL,
    [Observaciones] VARCHAR(MAX) NULL,
    [Fecha] DATETIME NOT NULL DEFAULT GETDATE(),
    [FechaUpdate] DATETIME NULL,
    CONSTRAINT [PK_SolicitudAprobacion] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_SolicitudAprobacion_Solicitud] FOREIGN KEY ([IdSolicitud]) REFERENCES dbo.Solicitud ([Id]),
    CONSTRAINT [FK_SolicitudAprobacion_EstadoSolicitud] FOREIGN KEY ([IdEstadoSolicitud]) REFERENCES dbo.EstadoSolicitud ([Id])
);
GO

-- =================================================================================
-- 4. DOMINIO PRINCIPAL DE PRÁCTICAS EN CURSO Y SEGUIMIENTO
-- =================================================================================

-- Entidad central del trámite académico y desempeño de práctica del estudiante
IF OBJECT_ID('dbo.Practica', 'U') IS NOT NULL DROP TABLE dbo.Practica;
CREATE TABLE dbo.Practica (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdSolicitud] INT NOT NULL,
    [IdInscripcionCarrera] INT NOT NULL,
    [IdTipoMateria] INT NOT NULL,
    [IdMateria] INT NOT NULL,
    [IdPracticaConvenio] INT NULL,
    [IdEstadoPractica] INT NOT NULL,
    [IdDocente] INT NULL, -- Tutor / Docente asignado
    [FechaInicio] DATE NULL,
    [FechaFin] DATE NULL,
    [TotalHoras] INT NOT NULL DEFAULT 360,
    [Nota] DECIMAL(5,2) NULL,
    [IdOrdenCobro] BIGINT NULL,
    [IdOferta] INT NULL,
    CONSTRAINT [PK_Practica] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Practica_Solicitud] FOREIGN KEY ([IdSolicitud]) REFERENCES dbo.Solicitud ([Id]),
    CONSTRAINT [FK_Practica_PracticaConvenio] FOREIGN KEY ([IdPracticaConvenio]) REFERENCES dbo.PracticaConvenio ([Id]),
    CONSTRAINT [FK_Practica_EstadoPractica] FOREIGN KEY ([IdEstadoPractica]) REFERENCES dbo.EstadoPractica ([Id])
);
GO

-- Datos específicos de la empresa asignada para la práctica
IF OBJECT_ID('dbo.PracticaEmpresa', 'U') IS NOT NULL DROP TABLE dbo.PracticaEmpresa;
CREATE TABLE dbo.PracticaEmpresa (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdPractica] INT NOT NULL,
    [NroConvenio] VARCHAR(50) NULL,
    [NombreEmpresa] VARCHAR(200) NOT NULL,
    [Supervisor] VARCHAR(150) NULL,
    [CargoSupervisor] VARCHAR(150) NULL,
    [AreaPractica] VARCHAR(150) NULL,
    [Turno] VARCHAR(50) NULL,
    CONSTRAINT [PK_PracticaEmpresa] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PracticaEmpresa_Practica] FOREIGN KEY ([IdPractica]) REFERENCES dbo.Practica ([Id]) ON DELETE CASCADE
);
GO

-- =================================================================================
-- 5. DOMINIO DE EVALUACIÓN, DOCUMENTACIÓN Y ACREDITACIÓN
-- =================================================================================

-- Registro de evaluaciones parciales y finales cuantitativas/cualitativas
IF OBJECT_ID('dbo.PracticaEvaluacion', 'U') IS NOT NULL DROP TABLE dbo.PracticaEvaluacion;
CREATE TABLE dbo.PracticaEvaluacion (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdPractica] INT NOT NULL,
    [IdAspectoEvaluacion] INT NOT NULL,
    [Nota] DECIMAL(5,2) NOT NULL,
    [Observaciones] VARCHAR(MAX) NULL,
    [Fecha] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_PracticaEvaluacion] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PracticaEvaluacion_Practica] FOREIGN KEY ([IdPractica]) REFERENCES dbo.Practica ([Id])
);
GO

-- Archivos digitales subidos por el estudiante o la universidad durante la práctica
IF OBJECT_ID('dbo.PracticaDocumento', 'U') IS NOT NULL DROP TABLE dbo.PracticaDocumento;
CREATE TABLE dbo.PracticaDocumento (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdPractica] INT NOT NULL,
    [IdTipoDocumento] INT NOT NULL,
    [NombreArchivo] VARCHAR(255) NOT NULL,
    [RutaArchivo] VARCHAR(500) NOT NULL,
    [FechaCarga] DATETIME NOT NULL DEFAULT GETDATE(),
    [IdUsuario] INT NOT NULL,
    CONSTRAINT [PK_PracticaDocumento] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PracticaDocumento_Practica] FOREIGN KEY ([IdPractica]) REFERENCES dbo.Practica ([Id]),
    CONSTRAINT [FK_PracticaDocumento_TipoDocumento] FOREIGN KEY ([IdTipoDocumento]) REFERENCES dbo.TipoDocumento ([Id])
);
GO

-- Registro definitivo de la materia de prácticas aprobada en el Kardex del estudiante
IF OBJECT_ID('dbo.PracticaRegistro', 'U') IS NOT NULL DROP TABLE dbo.PracticaRegistro;
CREATE TABLE dbo.PracticaRegistro (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [IdPractica] INT NOT NULL,
    [IdRegistroMateria] BIGINT NOT NULL,
    [FechaRegistro] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_PracticaRegistro] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PracticaRegistro_Practica] FOREIGN KEY ([IdPractica]) REFERENCES dbo.Practica ([Id])
);
GO

-- =================================================================================
-- REGISTROS INICIALES DE CATÁLOGOS (DATOS DE PRUEBA / SEMILLA)
-- =================================================================================

INSERT INTO dbo.EstadoSolicitud ([Nombre], [Descripcion]) VALUES 
('REGISTRADA', 'Solicitud creada por el estudiante en el portal'),
('EN_REVISION', 'Revisión de requisitos por Dirección de Carrera'),
('OBSERVADA', 'Requiere correcciones o documentación adicional'),
('APROBADA', 'Solicitud validada y aprobada para generar orden de cobro');

INSERT INTO dbo.EstadoPractica ([Nombre], [Descripcion]) VALUES 
('EN_CURSO', 'Práctica profesional en desarrollo en la empresa'),
('EN_EVALUACION', 'Informe final entregado, en proceso de calificación'),
('CONCLUIDA', 'Práctica evaluada y finalizada'),
('ACREDITADA', 'Calificación registrada en el kardex académico');

INSERT INTO dbo.TipoDocumento ([Nombre], [Obligatorio]) VALUES 
('Formulario de Apertura de Práctica', 1),
('Carta de Presentación Firmada', 1),
('Informe Trimestral de Avance', 0),
('Informe Final de Práctica Profesional', 1),
('Certificado de Conclusión de la Empresa', 1);
GO

PRINT 'Script de Base de Datos SAADS_PPRAC ejecutado exitosamente en PascalCase.';
