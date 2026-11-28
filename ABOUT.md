# Acerca de omniguard-frontend-react

## Descripción General

`omniguard-frontend-react` es la consola de mando web orientada a operadores *Blue Team* dentro de la plataforma **OmniGuard SOC**. Construida como una Single Page Application (SPA) sobre **React 19**, **TypeScript**, **Vite** y **Tailwind CSS v4**, ofrece visualización de métricas de telemetría en tiempo real, gestión forense de alertas mediante **Server-Sent Events (SSE)** e inventario interactivo de activos con correlación de vulnerabilidades CVE del NIST NVD.

Su diseño sigue el principio de **Zero-Token Storage**: la interfaz no almacena ningún secreto ni token de sesión en `localStorage` ni `sessionStorage`, delegando el transporte seguro de credenciales a cookies criptográficas `HttpOnly` administradas por el servidor para inmunizar la sesión frente a ataques XSS.

## Contexto del Proyecto

* **Plataforma:** OmniGuard SOC (Security Operations Center Distribuido)
* **Capa Arquitectónica:** Capa de Presentación y Respuesta a Incidentes
* **Tecnologías Principales:** React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query v5, TanStack Table, Recharts, Nginx
* **Licencia:** MIT License
* **Institución:** Universidad Politécnica de Chiapas — Ingeniería en Tecnologías de la Información e Innovación Digital
* **Autores:** Edwar Daniel Gonzalez Hernandez, Andres Eduardo Gonzalez Ruiz

---

## Metadatos para la sección "About" de GitHub

Copiar y pegar estos valores en el panel lateral derecho (icono de engranaje en **About**) del repositorio en GitHub:

* **Description:**
  `Consola de mando web Blue Team para OmniGuard SOC en React 19, TypeScript y Tailwind CSS v4. Monitoreo en tiempo real con SSE, gestion forense y seguridad Zero-Token Storage.`
* **Topics:**
  `react`, `typescript`, `vite`, `tailwindcss`, `cybersecurity`, `soc-dashboard`, `blue-team`, `sse`, `omniguard`
