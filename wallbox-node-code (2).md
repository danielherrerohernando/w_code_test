## Contexto

Wallbox está pensando en diversificar su negocio y para ello va a lanzar un nuevo servicio de recarga de móviles para grandes eventos (festivales de música, fiestas populares, etc). 

El proceso de carga será el siguiente: Un cliente se acerca al puesto de Wallbox, entrega su móvil y a cambio recibe un avisador que le irá indicando el estado del proceso de carga. Este avisador cuenta con un led a modo de semáforo:

    - rojo: cargando
    - naranja: carga al 80%
    - verde: cargado

Cuando el avisador se pone en verde, el cliente puede volver al puesto, pagar ($$$) e intercambiar el avisador por su móvil ya cargado.

## Tu misión

Desarrollar un servidor al que se van a conectar por websockets tanto los cargadores como los avisadores. 

Cada vez que el estado de un cargador cambie, éste envia un mensaje al servidor indicando su nuevo estado. El servidor reenvia el mensaje al avisador que esté asociado a ese cargador (por ejemplo el servidor está configurado para que el cargador *c1234* esté asociado con el avisador *wABCD*)

### Cargadores

Los cargadores se conectan a nuestro servidor de este modo:

```javascript
let connection = new WebSocket('ws://localhost:3100/chargers/c1234');
```

donde *c1234* es el id del cargador.

Los mensajes que nos envían los cargadores indicando un nuevo estado (*charging*, *charging80*, y *charged*) son así:

```javascript
connection.send(JSON.stringify(
    {
        "event": "chargingStatus",
        "data": {
            "status": "charging",
        }
    }
));
```

### Avisadores

Los avisadores se conectan a nuestro servidor de este modo:

```javascript
let connection = new WebSocket('ws://localhost:3200/widgets/wABCD');
```

donde *wABCD* es el id del avisador.

Los avisadores reciben por parte del servidor, mensajes exactamente iguales a los enviados por los cargadores.

## A tener en cuenta:

* Deberías dedicar unas 2/3 horas para realizar la práctica. Tu código debe ser sencillo, comprensible y ajustarse al enunciado. No hagas más de lo que se pide.

* (Node >= 10) && (JavaScript || TypeScript)

* Puedes utilizar cualquier framework/librería (express, Nest, lodash, ...) que consideres que pueda facilitarte el desarrollo. El único requisito es que utilices [ws](https://github.com/websockets/ws/) para los Websockets. Realmente podrías realizar la práctica usando únicamente esta librería.

* Queremos que incluyas algún test E2E. No hace falta que hagas una suite de tests exhaustiva, sino que queremos ver cómo probarías comunicaciones por Websockets. Mocha o jest, tú decides.

* Añade instrucciones de cómo ejecutar tu código y lanzar los tests. Puedes utilizar Docker.

* Si quieres, añade notas explicando las decisiones más importantes que has tomado.

* Pregúntanos si tienes cualquier duda!
