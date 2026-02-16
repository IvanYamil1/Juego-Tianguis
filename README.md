# Juego del Gato en el Tianguis 🐱

Un minijuego 3D interactivo donde un gato recorre un tianguis mexicano, visita diferentes puestos de comida y habla con los vendedores.

## Características

- **Escenario 3D**: Tianguis mexicano completo con puestos, decoraciones, árboles y ambiente colorido
- **6 Puestos diferentes** con decoraciones únicas:
  - 🌮 Tacos Don José (con comal)
  - 🍎 Frutas Frescas (con frutas decorativas)
  - 🍬 Dulces Típicos (con frascos de dulces)
  - 🌽 Elotes Preparados (con olla)
  - 🧃 Jugos Naturales (con licuadora)
  - 🥐 Panadería (con canasta de pan)

- **Gato 3D animado**: Modelo 3D completo con animaciones de caminar, correr y idle
- **Movimiento fluido**: Física realista con gravedad, salto y controles suaves
- **Cámara inteligente**: Sigue al gato con efecto de tracking del mouse
- **Audio**: Maullidos aleatorios del gato
- **Sistema de interacción**: Detecta cuando estás cerca de un puesto
- **Indicadores visuales**: Cada puesto muestra si está disponible o completado

## Controles

- **WASD** o **Flechas**: Mover al gato
- **Shift**: Correr
- **Space**: Saltar
- **E** o **Enter**: Interactuar con vendedores (cuando estés cerca)

## Tecnologías

- **Next.js 16**: Framework de React
- **React Three Fiber**: Renderizado 3D con Three.js
- **React Three Drei**: Helpers para R3F
- **TypeScript**: Tipado estático
- **Tailwind CSS 4**: Estilos
- **Framer Motion**: Animaciones

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx       # Layout principal de Next.js
│   ├── page.tsx         # Página principal del juego
│   └── globals.css      # Estilos globales
├── components/
│   ├── Scene.tsx        # Escena 3D principal con Canvas
│   ├── Tianguis.tsx     # Escenario del tianguis (piso, decoraciones)
│   ├── Puesto.tsx       # Componente de cada puesto individual
│   └── Cat.tsx          # Personaje del gato controlable
└── contexts/
    └── TianguisContext.tsx  # Estado global del juego
```

## Estado Actual

✅ **Completado:**
- Escenario 3D del tianguis con decoraciones (árboles, banderines, botes de basura)
- 6 puestos funcionales con diferentes estilos y decoraciones únicas
- **Modelo 3D del gato** con animaciones completas (caminar, correr, idle)
- Física realista (movimiento, salto, gravedad)
- Sistema de detección de proximidad a puestos
- Cámara que sigue al gato suavemente con tracking del mouse
- Audio de maullidos aleatorios
- Contexto para manejar estado del juego
- Controles fluidos y responsivos

⏳ **Pendiente (próximas fases):**
- Minijuegos específicos para cada puesto
- Sistema de puntos/recompensas
- UI mejorada con inventario de comidas
- Música de fondo
- Más efectos de sonido ambientales

## Notas de Desarrollo

El proyecto está basado en la misma tecnología que el portafolio existente (React Three Fiber + Next.js), pero con un escenario completamente nuevo diseñado específicamente para el ambiente de un tianguis mexicano.

Los minijuegos se implementarán en fases posteriores, manteniendo la estructura modular para facilitar la expansión.
