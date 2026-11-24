/**
 * Current legal documents, as GET /legal/documents/current will return them.
 *
 * The text is copied verbatim from the final documents (title to end, without
 * the school cover, page headers or footers). Legal text must not be edited,
 * summarized or corrected here: change it only by replacing it with a newer
 * official version of the document.
 */
import type { LegalDocuments, LegalDocument } from '@/data/legal';

const terms: LegalDocument = {
  kind: 'terms',
  title: 'Términos y Condiciones con Descargo de Responsabilidad de Criterika',
  lastUpdated: 'Última actualización: 23 de octubre de 2026.',
  intro: [
    'Estos Términos y Condiciones regulan el acceso y uso de Criterika, aplicación móvil educativa para Android e iOS que permite aprender, practicar y repasar ética, principios, leyes y normas relacionadas con el desarrollo de software mediante unidades, niveles, minijuegos y recompensas virtuales. Su aceptación establece las condiciones bajo las cuales el equipo de Criterika le permite utilizar el servicio.',
  ],
  sections: [
    {
      title: 'Identificación del equipo y contacto',
      paragraphs: [
        'El servicio es operado por José Antonio Calvo Aguilar, Uzzi Yazziel Gonzaga Gomez y Carlos Rafael Ruiz Ruiz, integrantes del equipo de Criterika, con domicilio en Central Sur 232, colonia Centro, código postal 29150, Suchiapa, Chiapas, México. En este documento, las expresiones “Criterika”, “el equipo” o “nosotros” se refieren a dichos integrantes en relación con la operación de la aplicación.',
        'Para soporte, reportes de errores, dudas sobre estas condiciones o revisión de suspensiones, escriba a soporte@criterika.com. Las solicitudes relacionadas con datos personales se atienden en privacidad@criterika.com, conforme al Aviso de Privacidad de Criterika.',
      ],
    },
    {
      title: 'Aceptación y requisitos de uso',
      paragraphs: [
        'Para crear una cuenta y utilizar Criterika debe tener 18 años cumplidos y capacidad legal para aceptar estas condiciones. Al registrarse, deberá manifestar expresamente su aceptación mediante el mecanismo habilitado en la aplicación. Si no está de acuerdo, no deberá crear una cuenta ni utilizar el servicio.',
        'Criterika no admite cuentas de menores de edad, incluso con autorización de padres, tutores o instituciones educativas. El usuario debe proporcionar una fecha de nacimiento veraz. Si se identifica una cuenta de una persona menor de edad, se restringirá su acceso y se tramitará la eliminación de sus datos conforme al Aviso de Privacidad.',
        'El servicio es gratuito y no incorpora suscripciones, compras con dinero real ni publicidad. Requiere una conexión a internet para todas sus funciones, incluidas las actividades educativas, el diccionario, la colección y las consultas de perfil o progreso. El usuario debe disponer de un dispositivo compatible y asumir los costos de conectividad que le cobre su proveedor.',
      ],
    },
    {
      title: 'Registro y seguridad de la cuenta',
      paragraphs: [
        'Para registrarse se solicitan nombre y apellidos, fecha de nacimiento, correo electrónico y contraseña. El usuario debe proporcionar información veraz y mantenerla actualizada. El acceso se realiza con correo y contraseña y mediante la autenticación en dos pasos enviada al correo registrado; la recuperación de contraseña también utiliza ese correo.',
        'La cuenta es de uso personal. Debe mantener bajo su control la contraseña y el acceso al correo, evitar compartir códigos de autenticación y comunicar a soporte cualquier acceso no autorizado que advierta. No debe vender, ceder, alquilar o compartir su cuenta para alterar el progreso o permitir que otra persona actúe en su nombre.',
        'El usuario responde por las actividades que autorice y por los incumplimientos que le sean atribuibles. La aparición de actividad en una cuenta no excluye la revisión de una posible intrusión ni traslada al usuario las responsabilidades que legalmente correspondan al equipo de Criterika.',
        'La imagen de perfil es opcional y puede ser una ilustración u otra imagen de su elección; no tiene que mostrar su rostro. Solo debe cargar imágenes que pueda utilizar legítimamente y que no vulneren derechos de otras personas ni incluyan contenido ilícito.',
      ],
    },
    {
      title: 'Alcance educativo y descargo de asesoría jurídica',
      paragraphs: [
        'Criterika es una herramienta didáctica e informativa. Su contenido jurídico se refiere al marco normativo mexicano y se complementa con contenido internacional relacionado con el desarrollo de software. La inclusión de contenido internacional no significa que una regla extranjera sea aplicable en México ni en cualquier situación concreta.',
        'Los conceptos, ejemplos, explicaciones, preguntas, respuestas y situaciones prácticas tienen fines de aprendizaje. No constituyen asesoría jurídica, un dictamen, una auditoría de cumplimiento ni una recomendación profesional para resolver un asunto real. El uso de la aplicación, la aceptación de estos términos o la comunicación con soporte no crea una relación abogado-cliente.',
        'Los ejercicios pueden simplificar hechos y conceptos para hacerlos comprensibles. Una respuesta considerada correcta en un minijuego no acredita que una conducta, producto o proyecto real cumpla todas las obligaciones legales que le sean aplicables. Antes de tomar decisiones jurídicas, profesionales o económicas, el usuario debe consultar las fuentes oficiales vigentes y, cuando corresponda, a un profesional competente.',
        'El marco legal, los criterios de autoridades y la jurisprudencia pueden cambiar. No garantizamos que todos los niveles, términos o explicaciones reflejen de inmediato la reforma o interpretación más reciente. Puede reportar una posible imprecisión a soporte@criterika.com, identificando el contenido y el motivo de su observación.',
        'Criterika no garantiza la aprobación de exámenes, la obtención de acreditaciones académicas ni un resultado profesional específico. Los resultados, la XP y los desbloqueos representan el avance dentro de la aplicación.',
      ],
    },
    {
      title: 'Niveles y registro del progreso',
      paragraphs: [
        'El camino de aprendizaje se organiza en unidades que contienen niveles. Cada nivel presenta una actividad de memorama, sopa de letras, preguntas, crucigrama o relación de conceptos. Para avanzar, el usuario debe superar el nivel conforme a las instrucciones y criterios mostrados en la aplicación.',
        'Se registran respuestas individuales, aciertos, errores, intentos fallidos, repeticiones y fechas de actividad. Un intento inconcluso no equivale a un nivel completado. La acreditación del progreso y de las recompensas depende de la validación y registro del resultado en el servicio.',
        'La XP y las gemas de un nivel se entregan únicamente la primera vez que se completa satisfactoriamente. Repetir un nivel sirve para practicar y no vuelve a otorgar esas recompensas. La XP representa el avance y no genera un nivel de jugador adicional. Los términos del diccionario se habilitan conforme al progreso educativo registrado.',
      ],
    },
    {
      title: 'Vidas y consecuencias de interrumpir un nivel',
      paragraphs: [
        'Cada cuenta dispone de un máximo de cinco vidas. Se pierde una vida al perder un nivel. También se pierde una vida si se abandona un intento antes de terminarlo, se cierra la aplicación durante su ejecución o se interrumpe la conexión a internet antes de completar el nivel.',
        'Con cero vidas no es posible iniciar niveles hasta recuperar al menos una. Las vidas se regeneran con el paso del tiempo y pueden recuperarse mediante paquetes adquiridos con gemas. Los tiempos, cantidades y costos aplicables se informan en la aplicación antes de confirmar el uso de gemas.',
        'Mantener una conexión estable y no cerrar la aplicación durante el intento ayuda a evitar interrupciones. Si considera que una pérdida de vida o un resultado se debe a un error de Criterika, puede solicitar revisión a soporte@criterika.com, indicando el nivel, la fecha aproximada y lo sucedido. Revisaremos la información disponible y corregiremos las inconsistencias que se confirmen; reportar un incidente no acredita por sí mismo que corresponda una restitución.',
      ],
    },
    {
      title: 'Gemas y colección de cartas',
      paragraphs: [
        'Las gemas se obtienen únicamente mediante el juego, conforme a las reglas de recompensa. Se utilizan para desbloquear evoluciones de cartas y adquirir paquetes de vidas. No se compran con dinero real, no se canjean por efectivo, no generan rendimientos y no tienen un valor monetario exigible al equipo.',
        'Al completar el último nivel de una unidad se obtiene la carta correspondiente. Las cartas y sus evoluciones son coleccionables exclusivamente estéticos: no se utilizan en combates, no modifican las respuestas correctas y no otorgan ventajas dentro de los minijuegos educativos. El usuario elige qué carta evolucionar y utiliza las gemas que indique la aplicación para desbloquear la siguiente etapa disponible.',
        'Las cartas, sus evoluciones, las vidas y las gemas se vinculan a la cuenta. Criterika no ofrece intercambio entre usuarios ni un mercado para venderlos. Debe revisar el costo y el efecto mostrados antes de confirmar una operación. No se reintegrarán gemas por el solo cambio de preferencia respecto de una evolución o paquete utilizado, sin perjuicio de corregir errores comprobados.',
        'Podemos revisar y corregir saldos, recompensas o desbloqueos duplicados, obtenidos mediante manipulación o acreditados por un error comprobado. La corrección se limitará a la inconsistencia identificada y no se utilizará para retirar arbitrariamente recompensas obtenidas legítimamente.',
      ],
    },
    {
      title: 'Licencia de uso y restricciones del software',
      paragraphs: [
        'Le concedemos una licencia limitada, no exclusiva, personal e intransferible para instalar y utilizar las versiones autorizadas de Criterika en dispositivos compatibles, con fines personales, académicos o pedagógicos sin fines de lucro y conforme a estas condiciones. La licencia es revocable por las causas y mediante los procedimientos previstos en este documento.',
        'El código de Criterika es privado. La licencia no transmite la propiedad del software ni autoriza a comercializarlo, redistribuir copias modificadas o presentarlo como un producto propio. Queda prohibido descompilar, desensamblar, realizar ingeniería inversa o eludir controles técnicos, salvo en los supuestos expresamente permitidos por la legislación aplicable.',
        'No se permite extraer masivamente mediante scraping o automatizaciones las explicaciones, ejercicios, bancos de preguntas, ilustraciones o la organización del contenido de la aplicación para reproducir el servicio o explotarlo comercialmente. Esta restricción no confiere exclusividad sobre los textos normativos oficiales ni limita los usos que la ley permita expresamente.',
      ],
    },
    {
      title: 'Propiedad intelectual y usos académicos permitidos',
      paragraphs: [
        'Los derechos que legalmente correspondan sobre el código fuente, la interfaz, la identidad gráfica, los esquemas explicativos, los ejercicios y el material pedagógico original de Criterika pertenecen a sus autores o titulares respectivos. Parte del contenido se elabora con herramientas de inteligencia artificial; su utilización no implica que todo elemento generado automáticamente tenga autoría humana o protección exclusiva. La reserva de derechos se limita a los derechos reconocidos por la legislación aplicable.',
        'No reclamamos derechos exclusivos sobre los textos legislativos, reglamentarios, administrativos o judiciales oficiales ni sobre sus traducciones oficiales. Deben distinguirse esos textos de las explicaciones, síntesis, anotaciones y ejercicios originales que Criterika prepare para su enseñanza. Una norma o concepto citado no se convierte en propiedad de Criterika por aparecer en un nivel.',
        'Estudiantes y docentes pueden compartir capturas y fragmentos del contenido en tareas, clases y presentaciones académicas sin fines de lucro, identificando a Criterika como fuente. Deben respetar el sentido del material y evitar mostrar datos personales de otros usuarios. Esta autorización no permite vender el contenido, distribuir masivamente la aplicación ni aparentar una certificación, colaboración o respaldo institucional que no exista.',
        'El usuario conserva los derechos que tenga sobre su imagen de perfil. Al cargarla, autoriza únicamente su almacenamiento, procesamiento técnico y visualización como parte de su cuenta durante el tiempo necesario para esa función. No se autoriza su uso en publicidad por el hecho de cargarla.',
      ],
    },
    {
      title: 'Uso permitido y conductas prohibidas',
      paragraphs: [
        'Debe utilizar Criterika de forma lícita y respetar sus reglas educativas y de acceso. Se prohíbe manipular respuestas, resultados, XP, gemas, vidas, rachas o desbloqueos; falsificar solicitudes o transacciones; aprovechar deliberadamente errores para obtener recompensas indebidas; y utilizar bots, scripts o automatizaciones para simular actividad o completar niveles.',
        'También se prohíbe intentar acceder a cuentas ajenas, obtener contraseñas o códigos de otras personas, eludir suspensiones, interferir con la API o la base de datos, introducir código malicioso, realizar ataques contra el servicio o utilizarlo para fines ilícitos. El uso académico permitido no autoriza pruebas intrusivas sobre los sistemas de producción sin autorización previa del equipo.',
        'Si detecta un error, puede reportarlo a soporte@criterika.com sin explotarlo ni divulgar datos de otras personas. Haber encontrado una vulnerabilidad no autoriza a acceder a información ajena o modificar registros.',
      ],
    },
    {
      title: 'Suspensiones y cancelación por incumplimiento',
      paragraphs: [
        'Ante indicios razonables de manipulación o acceso indebido, podemos restringir temporalmente las funciones afectadas o suspender el acceso mientras se revisan los hechos. Cuando un incumplimiento grave o reiterado se confirme, podemos cancelar definitivamente la cuenta. Consideraremos la gravedad, el impacto y la información disponible para adoptar una medida proporcional.',
        'La suspensión, su motivo y su alcance se comunicarán al correo registrado. Si es necesario actuar de inmediato para proteger cuentas o el servicio, podremos restringir primero el acceso y comunicar después la medida. No se divulgarán datos de terceros ni detalles técnicos que faciliten nuevos ataques.',
        'Puede solicitar revisión escribiendo a soporte@criterika.com desde el correo de su cuenta, explicando su inconformidad y aportando la información que considere pertinente. Revisaremos la medida y le comunicaremos el resultado. Una suspensión temporal no se convertirá en una retención indefinida por una sospecha sin resolver. Si se confirma un error en la medida o en los saldos, se realizarán las correcciones correspondientes.',
        'La suspensión o cancelación no impide ejercer derechos sobre datos personales mediante privacidad@criterika.com. La conservación o eliminación de información se sujetará al Aviso de Privacidad y a las obligaciones legales aplicables.',
      ],
    },
    {
      title: 'Privacidad y eliminación de la cuenta',
      paragraphs: [
        'El tratamiento de nombre, apellidos, fecha de nacimiento, correo, contraseña, imagen opcional, respuestas, métricas de aprendizaje y registros de progreso y gamificación se describe en el Aviso de Privacidad de Criterika, disponible durante el registro y en el módulo de Perfil. Ese documento establece las finalidades, proveedores, medidas de protección, plazos de conservación y mecanismos para ejercer derechos ARCO conforme a la legislación mexicana.',
        'Aceptar estos términos no sustituye el consentimiento específico que legalmente se requiera para un tratamiento de datos. Los datos se utilizan para operar la cuenta, las funciones educativas y las recompensas, proteger el servicio y atender las solicitudes descritas en el aviso; no se utilizan para publicidad.',
        'Puede solicitar la eliminación de su cuenta en privacidad@criterika.com. La cancelación implica perder el acceso al progreso, historial de intentos, términos desbloqueados, XP, racha, gemas, vidas, cartas y evoluciones vinculados a esa cuenta. Desinstalar la aplicación no equivale a solicitar su eliminación.',
        'Las cuentas con 24 meses consecutivos de inactividad podrán eliminarse con aviso por correo de al menos 30 días naturales. La eliminación operativa y la rotación de los respaldos, incluida la desaparición de datos retirados en un máximo de 30 días naturales de dichos respaldos, se rigen por el Aviso de Privacidad y las salvedades legales allí señaladas.',
      ],
    },
    {
      title: 'Disponibilidad y limitación de responsabilidad',
      paragraphs: [
        'Criterika se ofrece en su estado actual, “tal cual” y según disponibilidad. No garantizamos un funcionamiento ininterrumpido, la ausencia absoluta de errores de programación o la compatibilidad con todos los dispositivos o versiones de Android e iOS. Pueden ocurrir interrupciones por mantenimiento, actualizaciones, conectividad o incidencias de infraestructura.',
        'La aplicación depende de internet y de la comunicación con el servidor para validar resultados y mantener la información. Las fallas pueden interrumpir intentos o afectar temporalmente la visualización del progreso, gemas, vidas o colección. Puede reportar estas situaciones para su revisión y corrección. La existencia de respaldos no equivale a una garantía de recuperación inmediata o íntegra en cualquier incidente.',
        'Las decisiones de cumplimiento normativo y sus consecuencias deben basarse en el análisis del caso real. En la medida permitida por la ley, Criterika no asume responsabilidad por sanciones, multas, controversias o pérdidas económicas que deriven de utilizar sus ejercicios o explicaciones como sustituto de asesoría profesional, ni por daños indirectos o ganancias esperadas basados exclusivamente en ese uso educativo.',
        'La pérdida de datos, el mal funcionamiento de un dispositivo o las incompatibilidades derivadas de causas ajenas a Criterika no generan por sí mismos una obligación de indemnización a cargo del equipo. Esto no excluye la revisión de la causa del incidente ni la responsabilidad que legalmente corresponda por actos u omisiones imputables a Criterika.',
        'Ninguna disposición de este documento excluye responsabilidades por dolo, impone una renuncia a derechos irrenunciables o libera al equipo de obligaciones de seguridad, protección de datos o responsabilidad civil que la ley no permita limitar. Estas salvedades prevalecen sobre cualquier otra expresión de descargo.',
      ],
    },
    {
      title: 'Actualizaciones del contenido y de estas condiciones',
      paragraphs: [
        'Podemos corregir ejercicios, actualizar explicaciones, reordenar o sustituir niveles y ajustar recompensas, costos en gemas o tiempos de regeneración para mantener el contenido y el funcionamiento de Criterika. Informaremos los cambios relevantes mediante avisos en la aplicación o correo electrónico, y los costos y reglas aplicables se mostrarán antes de iniciar la actividad o confirmar la operación correspondiente.',
        'Las nuevas reglas se aplicarán hacia adelante. Los ajustes no se utilizarán para retirar arbitrariamente recompensas legítimas ni modificar de manera retroactiva operaciones concluidas, sin perjuicio de las correcciones de errores o manipulaciones previstas en este documento.',
        'Cuando se modifiquen estos Términos y Condiciones, publicaremos la versión actualizada y comunicaremos por correo los cambios relevantes y su fecha de entrada en vigor con anticipación razonable. Si afectan sustancialmente los derechos u obligaciones del usuario, solicitaremos su aceptación expresa antes de aplicárselos. Si no acepta, podrá dejar de utilizar el servicio y solicitar la eliminación de su cuenta, conservando sus derechos legales.',
      ],
    },
    {
      title: 'Legislación y solución de controversias',
      paragraphs: [
        'Estas condiciones se rigen por la legislación mexicana, incluidas las disposiciones federales aplicables y, en lo que corresponda, las del estado de Chiapas. El carácter internacional de parte del contenido educativo no modifica la ley que rige el uso de la aplicación.',
        'Si surge una controversia, puede contactar a soporte@criterika.com para intentar resolverla directamente. Esta vía es voluntaria y no constituye un requisito para acudir a autoridades, no suspende por sí sola plazos legales y no impone arbitraje obligatorio.',
        'Cuando proceda legalmente pactar competencia, las controversias se someterán a los tribunales competentes en el estado de Chiapas que correspondan a la materia y al domicilio de los responsables en Suchiapa. Se respetarán las competencias obligatorias y el derecho del usuario a acudir a la autoridad o tribunal que le reconozca la ley, incluida la autoridad competente en protección de datos y, cuando corresponda, la de protección al consumidor.',
        'Si una cláusula resulta inválida o inaplicable, se tendrá por no puesta en la parte afectada y las demás continuarán vigentes en cuanto puedan subsistir legalmente. En ningún caso se interpretará el documento para reducir derechos que la legislación reconozca de manera irrenunciable.',
      ],
    },
  ],
};

const privacy: LegalDocument = {
  kind: 'privacy',
  title: 'Aviso de Privacidad Integral de Criterika',
  lastUpdated: 'Última actualización: 23 de octubre de 2026.',
  intro: [
    'Criterika es una aplicación móvil educativa que permite aprender, practicar y repasar conceptos de ética, principios, leyes y normas del desarrollo de software mediante unidades, niveles y minijuegos. Este aviso describe el tratamiento de sus datos personales al registrarse, utilizar las actividades educativas, administrar sus recompensas y comunicarse con nuestro equipo.',
  ],
  sections: [
    {
      title: 'Responsables y medios de contacto',
      paragraphs: [
        'José Antonio Calvo Aguilar, Uzzi Yazziel Gonzaga Gómez y Carlos Rafael Ruiz Ruiz, integrantes del equipo de Criterika, somos responsables del tratamiento de los datos personales recabados mediante la aplicación, con domicilio para oír y recibir notificaciones en Central Sur 232, colonia Centro, código postal 29150, Suchiapa, Chiapas, México.',
        'Para cualquier consulta sobre sus datos personales, solicitudes de derechos ARCO, revocación del consentimiento o limitación de su uso, puede escribir a privacidad@criterika.com.',
        'Tratamos sus datos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y las demás disposiciones aplicables en México.',
      ],
    },
    {
      title: 'Datos personales que recabamos',
      paragraphs: [
        'Para crear y administrar su cuenta solicitamos obligatoriamente su nombre y apellidos, fecha de nacimiento, correo electrónico y contraseña. La fecha de nacimiento se utiliza para comprobar la mayoría de edad declarada. La contraseña se almacena mediante una representación hash, y no en texto legible.',
        'Como parte del funcionamiento de la cuenta, generamos un identificador interno y los elementos temporales necesarios para la autenticación en dos pasos, el mantenimiento de la sesión y la recuperación de contraseña. Los códigos de autenticación y recuperación se envían al correo electrónico registrado.',
        'De manera opcional, puede añadir una imagen de perfil seleccionada desde la galería de su dispositivo. La imagen no tiene que mostrar su rostro y puede consistir en una ilustración u otra imagen de su elección. No proporcionar una imagen no limita el acceso a las funciones educativas.',
        'Durante el uso de Criterika registramos las unidades y niveles cursados o completados, las respuestas individuales, los aciertos y errores, los intentos fallidos, las repeticiones de niveles y las fechas de actividad. Estos datos se vinculan con su cuenta para conservar su progreso y los resultados de sus actividades.',
        'También tratamos los datos de gamificación asociados a su cuenta: experiencia acumulada o XP; racha de actividad; cantidad de vidas y momentos de regeneración; saldo y movimientos de gemas; cartas obtenidas; evoluciones desbloqueadas; y conceptos y términos habilitados en el diccionario.',
        'Si nos contacta para recibir asistencia o ejercer sus derechos, tratamos su nombre, correo electrónico, el contenido de su solicitud y los elementos necesarios para acreditar su identidad o representación.',
        'Criterika no solicita datos personales sensibles ni utiliza la imagen de perfil para reconocimiento facial o identificación biométrica. Las respuestas a los ejercicios se utilizan para evaluar el aprendizaje del contenido; no se emplean para elaborar perfiles sobre creencias religiosas, filosóficas o políticas. Evite incluir datos sensibles o imágenes de terceros sin autorización en su imagen de perfil o comunicaciones.',
      ],
    },
    {
      title: 'Finalidades necesarias del tratamiento',
      paragraphs: [
        'Utilizamos los datos de registro para crear y administrar su cuenta, identificarla y aplicar la restricción de acceso a personas mayores de edad. El correo electrónico se utiliza para enviar códigos de autenticación en dos pasos, atender la recuperación de contraseña y comunicar asuntos necesarios de seguridad, privacidad y administración de la cuenta.',
        'Las respuestas, los aciertos, los errores y el historial de intentos permiten evaluar el resultado de cada actividad de memorama, sopa de letras, preguntas, crucigrama o relación de conceptos; registrar la finalización de niveles; conservar el avance por unidades; y permitir la repetición de actividades.',
        'Los registros de progreso permiten habilitar los siguientes niveles y los conceptos aprendidos en el diccionario. Las fechas de actividad se utilizan para mantener la racha y determinar la continuidad de uso de la cuenta.',
        'La información de gamificación se utiliza para otorgar la XP correspondiente a la primera finalización de cada nivel, administrar la pérdida y regeneración de vidas, acreditar las gemas obtenidas y registrar su uso para desbloquear evoluciones estéticas o adquirir paquetes de vidas con esa moneda virtual.',
        'Los registros de cartas y evoluciones permiten mostrar su colección y conservar los desbloqueos correspondientes. El historial de movimientos y recompensas permite verificar la integridad de los saldos y evitar acreditaciones duplicadas que no correspondan conforme a las reglas de la aplicación.',
        'También tratamos los datos necesarios para atender problemas relacionados con su cuenta, resolver inconsistencias en el progreso o las recompensas, responder solicitudes sobre datos personales, ejecutar la eliminación de cuentas y cumplir obligaciones legales aplicables.',
        'Los resultados de los ejercicios y las recompensas se determinan automáticamente conforme a las reglas de cada actividad. Su alcance se limita al aprendizaje y la progresión dentro de Criterika.',
      ],
    },
    {
      title: 'Tratamientos opcionales y finalidades secundarias',
      paragraphs: [
        'La personalización del perfil mediante una imagen es opcional. Puede utilizar Criterika sin cargarla y solicitar su retiro escribiendo a privacidad@criterika.com. Retirar la imagen no elimina su cuenta ni modifica su progreso educativo.',
        'No utilizamos sus datos para publicidad, mercadotecnia, boletines, encuestas de satisfacción o recordatorios de racha. No enviamos notificaciones push ni incorporamos herramientas externas de analítica del producto. Tampoco utilizamos información identificable de los jugadores para exposiciones, investigaciones o evaluaciones ante instituciones educativas.',
        'Si incorporamos finalidades secundarias que requieran su consentimiento, se las informaremos previamente y pondremos a su disposición un mecanismo para aceptarlas o rechazarlas. La negativa no impedirá acceder a las funciones educativas. Los mensajes de autenticación, recuperación de contraseña y modificaciones al aviso de privacidad se consideran comunicaciones necesarias sobre su cuenta.',
      ],
    },
    {
      title: 'Proveedores de servicios y transferencias',
      paragraphs: [
        'Utilizamos Amazon Web Services mediante EC2 para alojar y ejecutar la API de Criterika, y MongoDB Atlas para alojar la base de datos. La API procesa las solicitudes de cuenta, autenticación, aprendizaje y gamificación; la base de datos conserva la información de las cuentas y los registros asociados a cada jugador. Estos servicios y los respaldos de la aplicación se alojan en regiones de México dentro de las mismas plataformas.',
        'Utilizamos Brevo para enviar correos de autenticación en dos pasos, recuperación de contraseña y comunicaciones administrativas relacionadas con la privacidad. Para estos envíos se comunica el correo del destinatario y el contenido necesario para entregar el mensaje. No se proporciona a Brevo la contraseña de la cuenta ni el historial de respuestas, progreso o colección. La infraestructura de correo de Brevo implica tratamiento de los datos necesarios para el envío en la Unión Europea, fuera de México.',
        'Los proveedores que tratan información por nuestra cuenta actúan como encargados del tratamiento, conforme a las condiciones contractuales e instrucciones aplicables. Su intervención se limita a prestar los servicios contratados y está sujeta a obligaciones de protección y confidencialidad. Las comunicaciones con encargados se distinguen de las transferencias a terceros que deciden utilizar la información para fines propios.',
        'No vendemos datos personales ni los transferimos a anunciantes, profesores o instituciones educativas para sus propios fines. Podemos comunicar información a autoridades competentes cuando exista una obligación o un requerimiento legal aplicable. Si se requiere realizar una transferencia distinta que necesite su consentimiento, le informaremos previamente el destinatario y la finalidad y solicitaremos la autorización correspondiente.',
      ],
    },
    {
      title: 'Derechos ARCO y procedimiento para ejercerlos',
      paragraphs: [
        'Usted puede ejercer sus derechos de acceso, rectificación, cancelación y oposición. El acceso le permite conocer sus datos personales y las condiciones de su tratamiento; la rectificación, corregir información inexacta o incompleta; la cancelación, solicitar que dejen de tratarse y se supriman cuando corresponda; y la oposición, solicitar que se detengan tratamientos específicos en los supuestos previstos por la ley.',
        'Envíe su solicitud a privacidad@criterika.com e incluya su nombre, el correo vinculado a la cuenta, un medio para recibir la respuesta, el derecho que desea ejercer y una descripción clara de los datos o del tratamiento al que se refiere. Añada los elementos que permitan localizar la información. Para rectificar datos, indique los cambios solicitados y aporte la documentación que los sustente cuando corresponda.',
        'Deberá acreditar su identidad y, si otra persona actúa en su nombre, la representación legal. La verificación se realizará de manera proporcional a la solicitud. Si es necesaria una identificación, le indicaremos cómo remitir la información indispensable para comprobar su identidad. No debe enviarnos su contraseña ni los códigos utilizados para iniciar sesión.',
        'Le comunicaremos la determinación en un plazo máximo de 20 días hábiles contados desde la recepción de la solicitud, conforme a las reglas aplicables cuando sea necesario completarla. Si resulta procedente, la haremos efectiva dentro de los 15 días hábiles siguientes a la comunicación de la respuesta. Cada plazo podrá ampliarse una sola vez por un periodo igual cuando las circunstancias lo justifiquen; en ese caso, le informaremos la razón.',
        'El trámite es gratuito. Las respuestas y la información solicitada se entregarán por medios electrónicos, previa acreditación de identidad cuando corresponda. Si la solicitud no procede total o parcialmente, le explicaremos el motivo. Puede acudir a la Secretaría Anticorrupción y Buen Gobierno si considera vulnerado su derecho a la protección de datos personales.',
      ],
    },
    {
      title: 'Revocación del consentimiento y limitación del uso',
      paragraphs: [
        'Puede solicitar la revocación de su consentimiento o la limitación del uso o divulgación de sus datos mediante un correo a privacidad@criterika.com. Indique el tratamiento que desea revocar o limitar y proporcione los datos necesarios para identificar su cuenta y acreditar su identidad. Atenderemos estas solicitudes con los mismos requisitos y plazos de respuesta indicados para los derechos ARCO.',
        'La revocación no tendrá efectos retroactivos. Cuando un tratamiento sea indispensable para operar su cuenta, le explicaremos las consecuencias de retirarlo y, en su caso, tramitaremos la cancelación del servicio. Si existe una obligación legal que requiera conservar determinados datos, le informaremos su alcance y fundamento.',
      ],
    },
    {
      title: 'Conservación y eliminación de datos personales',
      paragraphs: [
        'Conservamos los datos de registro, progreso, historial educativo y gamificación mientras su cuenta permanezca activa y sean necesarios para prestar el servicio, salvo que solicite antes su cancelación.',
        'Cuando una cuenta acumule 24 meses consecutivos sin actividad educativa ni uso de sus funciones, procederemos a su eliminación por inactividad. Le enviaremos un correo con al menos 30 días naturales de anticipación. Si vuelve a utilizar su cuenta durante ese periodo, se detendrá la eliminación por inactividad.',
        'Puede solicitar la eliminación de su cuenta escribiendo a privacidad@criterika.com. La solicitud se atenderá conforme al procedimiento y los plazos ARCO. La eliminación comprende sus datos de registro y acceso, imagen de perfil, respuestas e intentos, progreso, XP, racha, vidas, saldo y movimientos de gemas, cartas, evoluciones y términos desbloqueados. Esta información dejará de estar disponible para continuar la experiencia asociada a la cuenta eliminada.',
        'Los datos se retirarán de las bases y archivos operativos bajo nuestro control y se eliminarán las copias o exportaciones operativas que correspondan. Los respaldos de Criterika en las plataformas de alojamiento se mantienen con una antigüedad máxima de 30 días naturales. Los datos retirados de los sistemas operativos dejarán de figurar en dichos respaldos dentro de los 30 días naturales siguientes a su retiro.',
        'Durante la rotación de respaldos, la información pendiente de eliminación permanecerá con acceso restringido y no se utilizará para reactivar cuentas. Si es necesario restaurar un respaldo para recuperar el servicio, aplicaremos nuevamente las eliminaciones antes de restablecer su uso ordinario.',
        'Los registros transaccionales de correo en Brevo se conservarán durante un mes desde cada evento. Su eliminación puede ejecutarse hasta 24 horas después de finalizar ese periodo. No se conservarán vistas previas del contenido de los correos nuevos. Los códigos y enlaces de autenticación o recuperación se invalidarán al usarse o vencer; sus valores invalidados se eliminarán como máximo en las 24 horas siguientes.',
        'Si una disposición legal, una controversia o la determinación de responsabilidades exige conservar información específica, mantendremos únicamente los datos necesarios durante el plazo aplicable, bajo bloqueo y separados del uso ordinario. Concluido ese plazo, procederemos a su supresión. La cancelación de datos en poder de proveedores se gestionará conforme a sus funciones y obligaciones aplicables.',
        'Desinstalar la aplicación de su dispositivo no elimina por sí mismo la cuenta ni sus datos almacenados en nuestros sistemas.',
      ],
    },
    {
      title: 'Medidas de seguridad y confidencialidad',
      paragraphs: [
        'Utilizamos HTTPS con TLS para proteger las comunicaciones entre la aplicación y el servidor, almacenamos las contraseñas mediante hash y aplicamos autenticación en dos pasos mediante códigos enviados al correo registrado.',
        'El acceso administrativo está restringido a José Antonio Calvo Aguilar, Uzzi Yazziel Gonzaga Gomez y Carlos Rafael Ruiz Ruiz. El acceso a información de usuarios se limita a las tareas necesarias para administrar Criterika, atender incidencias de las cuentas y cumplir las obligaciones relacionadas con los datos personales. Quienes tienen acceso deben mantener la confidencialidad de la información.',
        'Mantenemos respaldos con acceso restringido y aplicamos medidas de control de acceso, conservación y eliminación conforme a este aviso. Cuando ocurra una vulneración de seguridad que afecte significativamente sus derechos patrimoniales o morales, le informaremos sin dilación para que pueda adoptar las medidas correspondientes.',
      ],
    },
    {
      title: 'Imágenes del dispositivo y tecnologías de sesión',
      paragraphs: [
        'El acceso a imágenes de su dispositivo se utiliza únicamente cuando decide añadir o cambiar su imagen de perfil. Criterika recibe la imagen que usted selecciona para asociarla a su cuenta; no copia el resto de su galería ni crea una galería personal dentro de la aplicación. Puede rechazar el acceso a las imágenes y continuar utilizando las funciones educativas.',
        'Puede retirar los permisos correspondientes desde la configuración del sistema operativo. Retirar un permiso impide nuevos accesos al dispositivo, pero no elimina la imagen ya enviada; para solicitar su retiro de la cuenta puede escribir al correo de privacidad. No solicitamos acceso a cámara, micrófono, contactos o ubicación.',
        'Criterika es una aplicación móvil y no utiliza cookies de navegador para publicidad o seguimiento. Los identificadores o elementos de sesión almacenados localmente se utilizan exclusivamente para mantener o comprobar el acceso a la cuenta y se invalidan o eliminan cuando corresponde al cerrar sesión o cancelar la cuenta.',
        'La aplicación no recopila para su base de datos de jugadores direcciones IP, sistema operativo, modelo del dispositivo, versión de la aplicación o bitácoras de acceso y errores. Las comunicaciones por internet requieren el procesamiento técnico de direcciones IP. Los servicios de infraestructura y correo pueden generar los registros técnicos necesarios para operar, proteger y entregar el servicio; estos registros no se utilizan por Criterika para publicidad o perfiles de navegación.',
      ],
    },
    {
      title: 'Restricción a personas mayores de edad y datos de pago',
      paragraphs: [
        'Criterika está disponible exclusivamente para personas de 18 años o más. La fecha de nacimiento declarada se utiliza para aplicar esta restricción. No ofrecemos un procedimiento para registrar a menores mediante autorización de padres o tutores. Si identificamos una cuenta de una persona menor de edad, restringiremos su acceso y tramitaremos la eliminación de sus datos, con las salvedades legales que correspondan. Puede comunicar una situación de este tipo a privacidad@criterika.com.',
        'Las gemas se obtienen únicamente jugando y se utilizan dentro de Criterika para evoluciones estéticas de cartas o paquetes de vidas. No se compran con dinero real. No ofrecemos suscripciones ni compras con dinero real, y no mostramos publicidad. No solicitamos datos de tarjetas bancarias ni de facturación para estas funciones.',
      ],
    },
    {
      title: 'Consulta y modificaciones al aviso de privacidad',
      paragraphs: [
        'Este aviso está disponible durante la creación de la cuenta, antes de enviar los datos de registro, y en el módulo de Perfil. También puede solicitar una copia escribiendo a privacidad@criterika.com.',
        'Las modificaciones se comunicarán al correo electrónico registrado y se publicará la versión actualizada en los espacios de consulta de la aplicación. La comunicación indicará la fecha de entrada en vigor y los cambios relevantes. Cuando una modificación incorpore un tratamiento que requiera su consentimiento, lo solicitaremos antes de iniciar ese tratamiento.',
      ],
    },
  ],
};

export const mockLegalDocuments: LegalDocuments = { terms, privacy };
