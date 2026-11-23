# Despliegue web — OmniGuard Frontend React

Consulte el plan maestro en el repositorio central:

[WEB-DEPLOYMENT-PLAN.md](../WEB-DEPLOYMENT-PLAN.md)

## Rol

Sirve la interfaz React mediante Nginx y redirige `/api/*` hacia Core Java.

## Construcción

```powershell
npm run build
docker compose build
```

## Variables

```text
VITE_API_BASE_URL=/api/v1
VITE_APP_TITLE=OmniGuard SOC Platform
VITE_POLLING_INTERVAL_MS=15000
```

Las variables `VITE_*` quedan visibles en el navegador. No colocar secretos en ellas.

## Producción

Usar el target `production` del Dockerfile y Nginx. No exponer el servidor Vite de desarrollo.

## Proxy

`/api/*` debe reenviarse internamente a `core-api:8080/api/*`.
