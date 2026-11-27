# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Probar el nivel y el registro

- Deja `EXPO_PUBLIC_API_URL` vacía para usar las cuentas de prueba de `src/mocks/session.ts`. En **Niveles**, abre **Discriminación algorítmica** e inicia el nivel. El recorrido incluye memorama, sopa de letras, preguntas, crucigrama y relacionar.
- Al fallar una ejecución, la actividad vuelve al final de la cola con sus errores reiniciados. Tres fallos en la misma actividad o una salida confirmada consumen la vida reservada. Al aprobar, se libera esa vida y se actualiza el camino.
- Aprueba los dos niveles pendientes y abre el cierre de **Sesgo Algorítmico e IA** para ver la recompensa de unidad y su carta. Puedes repetir los niveles aprobados como práctica y comprar vidas de demostración cuando se agoten. Los tableros se reutilizan en esta unidad de prueba. Los saldos, cartas y aprobaciones de demostración se conservan en memoria mientras la aplicación está abierta.
- Para conectar el registro, copia `.env.example` a `.env.local`, asigna a `EXPO_PUBLIC_API_URL` el origen de la API y reinicia Expo. El origen debe ser accesible desde el equipo o celular donde corra la app. La API debe exponer `GET /api/v1/legal/documents/current` y las rutas de inicio, reenvío y verificación bajo `/api/v1/auth/registrations`.
- La verificación real abre una sesión en memoria durante la ejecución de la app. El acceso con una cuenta existente y la recuperación quedan disponibles con datos de prueba al dejar vacía la URL.
- La conexión del juego requiere que el backend exponga el camino, la vista previa, el inicio y la consulta de intentos, la ejecución actual, las respuestas, el heartbeat, el abandono y la economía. Estas operaciones están descritas en el contrato OpenAPI. El frontend mantiene el flujo de demostración mientras se publican las rutas. [Contrato de juego](https://github.com/jacalvoag/criterika-backend/blob/develop/docs/openapi/criterika_openapi_v1.yaml)

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
