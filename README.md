# Quiz del Profesor Bryan — Firebase

Proyecto web del quiz de Tecnología Digital, conectado a Firebase Authentication + Firestore.

## Archivos
- `index.html`: quiz público.
- `admin.html`: panel privado del profesor.
- `app.js`: preguntas y guardado de resultados.
- `admin.js`: inicio de sesión y consulta de resultados.
- `firebase.js` / `firebase-config.js`: conexión con Firebase.
- `firestore.rules`: reglas de seguridad.

## Configuración de Firestore
1. En Firebase > Authentication > Usuarios, copia el UID de tu cuenta de profesor.
2. En Firestore crea una colección llamada `admins`.
3. Crea un documento cuyo ID sea exactamente ese UID.
4. Añade el campo booleano `enabled` con valor `true`.
5. Publica/aplica las reglas de `firestore.rules` en Firestore.

Con esas reglas, cualquiera puede crear un resultado al terminar el quiz, pero solo un usuario cuyo UID esté autorizado en `admins` puede leer, modificar o borrar resultados.

## Publicación
El proyecto puede publicarse como sitio estático en GitHub Pages. Firebase seguirá funcionando como backend.
