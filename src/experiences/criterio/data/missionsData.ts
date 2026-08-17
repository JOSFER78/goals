import { CriterioMission } from '../types';

export const CRITERIO_MISSIONS: CriterioMission[] = [
  // CATEGORÍA: COLEGIO & ENTORNO CERCANO (1-12)
  {
    id: 'col-01',
    title: 'El comunicado de huelga sorpresa',
    category: 'colegio',
    minAge: 8,
    situation: 'Un compañero reenvía una captura de pantalla borrosa que dice que mañana no hay clase porque los profesores van a hacer huelga.',
    authorHandle: '@amigo_clase',
    authorBadge: 'WhatsApp Grupo',
    mediaType: 'chat_capture',
    initialClaim: '«Mañana no vengáis al colegio, huelga total de profes confirmada»',
    emotionalHook: 'Alegría por no tener clase al día siguiente.',
    missingContext: 'Falta el membrete oficial del colegio, la firma de dirección y aviso en la plataforma educativa.',
    options: [
      {
        id: 'opt-1',
        text: 'Quedarme durmiendo y reenviarlo a todos los que conozco.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Reenviar una captura sin membrete oficial puede hacer que varios compañeros falten a clase injustificadamente.'
      },
      {
        id: 'opt-2',
        text: 'Consultar la app oficial del centro escolar o pedirle a un familiar que verifique el correo del colegio.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Correcto! Los avisos oficiales de apertura o cierre de centros se comunican siempre por los canales reglamentarios de la escuela.'
      },
      {
        id: 'opt-3',
        text: 'Insultar al compañero que lo envió diciendo que es un mentiroso.',
        quality: 'skeptical',
        criterioScore: 20,
        feedback: 'No hace falta atacar a las personas; basta con pedirles la fuente oficial amablemente.'
      }
    ],
    revealedEvidence: 'El colegio operó con total normalidad. La captura era una broma editada de otro año.',
    trickExplanation: 'Las capturas de pantalla son los formatos más fáciles de falsificar alterando el texto con herramientas básicas.'
  },
  {
    id: 'col-02',
    title: 'La expulsión del delegado',
    category: 'colegio',
    minAge: 10,
    situation: 'Circula un audio de 10 segundos en el que parece escucharse al director diciendo que expulsará a un alumno para siempre.',
    authorHandle: '@rumores_insti',
    authorBadge: 'Canal Anónimo',
    mediaType: 'voice_memo',
    initialClaim: '«El director ha expulsado injustamente al delegado por quejarse del menú»',
    emotionalHook: 'Sentimiento de injusticia e indignación grupal.',
    missingContext: 'El audio estaba cortado: el director decía "Si alguien comete una falta muy grave como agredir, el reglamento contempla la expulsión, pero este no es el caso".',
    options: [
      {
        id: 'opt-1',
        text: 'Organizar una protesta en el recreo sin hablar con nadie.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Actuar por un audio de 10 segundos descontextualizado suele generar conflictos innecesarios.'
      },
      {
        id: 'opt-2',
        text: 'Preguntar al delegado o al tutor antes de sacar conclusiones sobre un fragmento recortado.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Excelente! Los recortes de audio despojan a las frases de su sentido real.'
      }
    ],
    revealedEvidence: 'El director estaba explicando el reglamento general, no sancionando a nadie.',
    trickExplanation: 'El sesgo del recorte selectivo: eliminar el principio y el final de una frase cambia su significado por completo.'
  },
  {
    id: 'col-03',
    title: 'El examen filtrado en Telegram',
    category: 'colegio',
    minAge: 12,
    situation: 'Un canal de Telegram ofrece el examen de Matemáticas de 2º ESO por 5 € en tarjeta regalo.',
    authorHandle: '@examenes_filtrados_top',
    mediaType: 'chat_capture',
    initialClaim: '«Tenemos el examen real que pondrá tu profesor mañana 100% garantizado»',
    missingContext: 'Los profesores elaboran exámenes únicos para cada grupo.',
    options: [
      {
        id: 'opt-1',
        text: 'Comprarlo rápido entre varios compañeros.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Es una estafa clásica donde tras pagar te bloquean o te envían un archivo de ejercicios viejos de internet.'
      },
      {
        id: 'opt-2',
        text: 'Ignorar y avisar a tus compañeros de que se trata de un timo para robar dinero.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Muy bien! Ningún canal anónimo tiene acceso a los ordenadores de tus profesores.'
      }
    ],
    revealedEvidence: 'El canal era una cuenta fraudulenta que estafó a decenas de estudiantes en varias ciudades.',
    trickExplanation: 'Urgencia artificial y promesas de atajos fáciles para obtener dinero o datos.'
  },
  {
    id: 'col-04',
    title: 'La nueva norma de los teléfonos móviles',
    category: 'colegio',
    minAge: 12,
    situation: 'Un tuit asegura que el Ministerio de Educación ha prohibido llevar mochilas al instituto en toda España.',
    authorHandle: '@alertas_spain_hoy',
    mediaType: 'text',
    initialClaim: '«¡HISTÓRICO! Queda prohibido el uso de mochilas en todos los colegios españoles desde este lunes»',
    missingContext: 'El BOE y las consejerías autonómicas regulan la normativa educativa oficial.',
    options: [
      {
        id: 'opt-1',
        text: 'Creerlo porque tiene 15.000 retuits.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'El número de retuits solo mide popularidad o bots, jamás la veracidad legal de una norma.'
      },
      {
        id: 'opt-2',
        text: 'Consultar el BOE (Boletín Oficial del Estado) o la web del Ministerio de Educación.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Impecable! Toda regulación legal debe aparecer publicada obligatoriamente en el BOE.'
      }
    ],
    revealedEvidence: 'Era una noticia inventada por una cuenta parodia para ganar seguidores.',
    primarySourceName: 'Boletín Oficial del Estado (BOE)',
    primarySourceUrl: 'https://www.boe.es',
    trickExplanation: 'Suplantación de tono institucional con mayúsculas y palabras de urgencia.'
  },

  // CATEGORÍA: REDES & VIRALES (13-25)
  {
    id: 'red-01',
    title: 'El sorteo de la consola de última generación',
    category: 'sorteos',
    minAge: 10,
    situation: 'Una cuenta llamada @streamer_famoso_regalos con 12 seguidores publica que regala 50 consolas a los primeros que hagan clic en un enlace externo y pongan su correo y contraseña.',
    authorHandle: '@streamer_famoso_regalos',
    authorBadge: 'Cuenta Creada Ayer',
    mediaType: 'image_prompt',
    initialClaim: '«¡Por llegar a 1M de suscriptores regalo 50 consolas! Entra ya al link de la bio y pon tus datos»',
    emotionalHook: 'Deseo de conseguir un premio caro gratis.',
    missingContext: 'La cuenta oficial verificada del streamer no ha publicado nada similar.',
    options: [
      {
        id: 'opt-1',
        text: 'Introducir rápidamente mis datos para no quedarme sin consola.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Phishing directo: te robarán la cuenta de correo o el acceso a tus videojuegos.'
      },
      {
        id: 'opt-2',
        text: 'Comprobar si la cuenta tiene el tick de verificación oficial y ver si el streamer lo ha dicho en su canal real.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Exacto! Las cuentas de sorteos falsos usan fotos robadas de creadores famosos para pescar datos.'
      }
    ],
    revealedEvidence: 'La página enlazada era un sitio de robo de credenciales desactivado por ciberseguridad.',
    trickExplanation: 'Suplantación de identidad (*Phishing*) mediante la técnica del cebo irresistible.'
  },
  {
    id: 'red-02',
    title: 'El vídeo del animal legendario en la playa',
    category: 'redes',
    minAge: 8,
    situation: 'Un vídeo de 5 segundos en TikTok muestra lo que parece ser un dragón volando sobre una playa de Alicante.',
    authorHandle: '@misterios_virales',
    mediaType: 'image_prompt',
    initialClaim: '«¡Captado en directo criatura mitológica viva en la costa española!»',
    missingContext: 'El vídeo fue creado con software de efectos especiales 3D (CGI/Blender) por un estudiante de animación.',
    options: [
      {
        id: 'opt-1',
        text: 'Compartir diciendo que los dragones existen en secreto.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Las afirmaciones extraordinarias requieren pruebas extraordinarias y consenso biológico.'
      },
      {
        id: 'opt-2',
        text: 'Buscar al autor original o comentarios técnicos que identifiquen el render CGI.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Muy bien! Los artistas de efectos visuales suelen compartir sus creaciones que luego cuentas virales resuben sin dar crédito como si fueran reales.'
      }
    ],
    revealedEvidence: 'El autor original publicó el *making of* de su animación 3D en su portfolio de ArtStation.',
    trickExplanation: 'Descontextualización de arte digital para presentarlo como fenómeno real.'
  },
  {
    id: 'red-03',
    title: 'El mensaje de WhatsApp con el punto negro',
    category: 'redes',
    minAge: 10,
    situation: 'Un mensaje en cadena dice: *"Si no reenvías esto a 15 contactos antes de medianoche, WhatsApp pasará a ser de pago y se borrarán tus fotos"*.',
    authorHandle: '@cadena_whatsapp',
    mediaType: 'text',
    initialClaim: '«Aviso urgente del director de WhatsApp: reenvía a 15 personas para mantener tu cuenta gratis»',
    missingContext: 'Las empresas de tecnología nunca utilizan mensajes en cadena reenviados para avisar de cambios de servicio.',
    options: [
      {
        id: 'opt-1',
        text: 'Reenviarlo a todos los chats grupales por si acaso.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'El "por si acaso" es el combustible que mantiene vivas las cadenas de desinformación desde hace 20 años.'
      },
      {
        id: 'opt-2',
        text: 'Romper la cadena y no reenviar, sabiendo que las empresas comunican cambios en sus blogs oficiales.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Perfecto! Romper las cadenas inútiles limpia los chats de spam y desinformación.'
      }
    ],
    revealedEvidence: 'Es una de las cadenas más antiguas de internet, existente desde la época del correo electrónico en 1999.',
    trickExplanation: 'Amenaza de pérdida imaginaria con fecha límite de urgencia.'
  },

  // CATEGORÍA: CIENCIA & ESPACIO (26-40)
  {
    id: 'cie-01',
    title: 'La cura milagrosa con limón y bicarbonato',
    category: 'ciencia',
    minAge: 12,
    situation: 'Una publicación en Instagram afirma que mezclar zumo de limón caliente con bicarbonato destruye todas las células malignas y es 10.000 veces mejor que cualquier medicina.',
    authorHandle: '@salud_ancestral_magica',
    mediaType: 'text',
    initialClaim: '«El secreto que los médicos no quieren que sepas: el limón caliente cura todo al 100%»',
    missingContext: 'La medicina basada en evidencia requiere ensayos clínicos rigurosos y revisión por pares.',
    options: [
      {
        id: 'opt-1',
        text: 'Decirle a mis abuelos que dejen sus medicinas y beban limón.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Peligrosísimo. Abandonar tratamientos médicos por remedios caseros puede costar la vida.'
      },
      {
        id: 'opt-2',
        text: 'Consultar fuentes médicas oficiales como el Ministerio de Sanidad, CSIC o la OMS.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Excelente! La nutrición es saludable, pero ningún alimento individual es una panacea mágica que sustituya la ciencia médica.'
      }
    ],
    revealedEvidence: 'Los estudios científicos del CSIC y consensos médicos confirman que el limón tiene vitamina C pero no cura enfermedades graves por sí solo.',
    primarySourceName: 'Consejo Superior de Investigaciones Científicas (CSIC)',
    primarySourceUrl: 'https://www.csic.es',
    trickExplanation: 'Teoría de la conspiración de "lo que no quieren que sepas" combinada con promesas de salud sin esfuerzo.'
  },
  {
    id: 'cie-02',
    title: 'El asteroide que destruirá la Tierra el mes que viene',
    category: 'ciencia',
    minAge: 10,
    situation: 'Un titular en un portal de noticias dice: *"¡ALERTA MUNDIAL! La NASA detecta un asteroide gigante que pasará rozando la Tierra a toda velocidad"*.',
    authorHandle: '@clickbait_news_24h',
    mediaType: 'text',
    initialClaim: '«Un asteroide colosal amenaza la supervivencia humana en las próximas semanas según la NASA»',
    missingContext: 'En astronomía, "rozando" puede significar pasar a 5 millones de kilómetros (más de 13 veces la distancia a la Luna), sin ningún riesgo de impacto.',
    options: [
      {
        id: 'opt-1',
        text: 'Entrar en pánico y creer que el fin del mundo está cerca.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'El titular juega con la escala espacial para asustar al lector no iniciado en astronomía.'
      },
      {
        id: 'opt-2',
        text: 'Consultar la base de datos oficial del Centro de Estudios de Objetos Cercanos a la Tierra de la NASA (CNEOS/PDS).',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Brillante! La telemetría de la NASA registra con precisión milimétrica la trayectoria de asteroides, confirmando riesgo cero.'
      }
    ],
    revealedEvidence: 'El asteroide 2024-X pasó a 6.2 millones de kilómetros de la Tierra con una probabilidad de impacto del 0.00000%.',
    primarySourceName: 'NASA Planetary Data System (PDS) & CNEOS',
    primarySourceUrl: 'https://pds.nasa.gov',
    trickExplanation: 'Uso tramposo del vocabulario técnico astronómico para generar terror y clics sensacionalistas.'
  },

  // CATEGORÍA: IA, DEEPFAKES & VOZ CLONADA (41-60)
  {
    id: 'ia-01',
    title: 'El audio urgente de mamá pidiendo dinero',
    category: 'ia_deepfakes',
    minAge: 12,
    situation: 'Recibes una nota de voz en WhatsApp de un número desconocido con la voz idéntica de tu madre diciendo que ha tenido un problema con el coche y necesita que le envíes una transferencia inmediata.',
    authorHandle: '@numero_desconocido',
    mediaType: 'voice_memo',
    initialClaim: '«Hijo, soy mamá, se me ha roto el móvil y estoy en una grúa, envíame 50 € a este Bizum urgente»',
    emotionalHook: 'Miedo por la seguridad de un ser querido y urgencia extrema.',
    missingContext: 'Existen herramientas de IA capaces de clonar una voz con solo 3 segundos de un vídeo público de Instagram o TikTok.',
    options: [
      {
        id: 'opt-1',
        text: 'Enviar el dinero de inmediato sin hacer preguntas.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Peligro grave de estafa por voz clonada (vishing con IA).'
      },
      {
        id: 'opt-2',
        text: 'Llamar directamente al número de teléfono habitual de mi madre o a otro familiar para contrastar antes de enviar nada.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Impresionante! La regla de oro ante emergencias financieras es verificar siempre por un canal secundario seguro o con una palabra clave familiar secreta.'
      }
    ],
    revealedEvidence: 'La madre estaba tranquilamente en el trabajo. Los estafadores clonaron su voz de un vídeo público en redes.',
    trickExplanation: 'Clonación neuronal de voz combinada con ingeniería social de alta presión psicológica.'
  },
  {
    id: 'ia-02',
    title: 'La foto del Papa con el abrigo de plumas gigante',
    category: 'ia_deepfakes',
    minAge: 12,
    situation: 'Aparece una foto hiperrealista del Papa Francisco vistiendo un enorme abrigo blanco de diseñador de lujo en plena calle de Roma.',
    authorHandle: '@tendencias_moda_viral',
    mediaType: 'image_prompt',
    initialClaim: '«El Papa sorprende al mundo desfilando con un abrigo de alta costura valorado en 50.000 €»',
    missingContext: 'La imagen fue generada con Midjourney v5 por un creador digital en Reddit como experimento artístico.',
    options: [
      {
        id: 'opt-1',
        text: 'Creerla ciegamente porque parece una foto con textura de cámara réflex.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Las IAs actuales replican la iluminación fotográfica a la perfección; la nitidez ya no prueba realidad.'
      },
      {
        id: 'opt-2',
        text: 'Analizar detalles anatómicos (manos, gafas, texturas) y comprobar si las agencias de prensa oficiales (EFE, Reuters) lo publicaron.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Excelente ojo clínico! La mano que sostenía el crucifijo tenía los dedos fusionados y el crucifijo carecía de cadena física continua.'
      }
    ],
    revealedEvidence: 'El autor de la imagen confirmó que la creó en Midjourney en 2023.',
    trickExplanation: 'Generación por difusión fotorrealista sin contexto de autoría.'
  },
  {
    id: 'ia-03',
    title: 'El chatbot que inventó un artículo de ley',
    category: 'ia_deepfakes',
    minAge: 14,
    situation: 'Un alumno le pide a ChatGPT que le diga qué ley española prohíbe poner deberes los fines de semana. La IA responde con absoluta seguridad: *"Según el Artículo 42.3 de la Ley Orgánica 8/2023 de Conciliación Juvenil, queda terminantemente prohibido..."*.',
    authorHandle: '@ia_asistente',
    mediaType: 'text',
    initialClaim: '«El Artículo 42.3 de la Ley Orgánica 8/2023 prohíbe los deberes escolares en España»',
    missingContext: 'Esa ley con ese título y ese artículo no existe en el Boletín Oficial del Estado; la IA alucinó un nombre legal plausible.',
    options: [
      {
        id: 'opt-1',
        text: 'Llevar la respuesta impresa al profesor y negarme a hacer los deberes basándome en ese artículo.',
        quality: 'impulsive',
        criterioScore: 0,
        feedback: 'Hacer el ridículo: presentar una ley inventada por una IA en clase demuestra no haber contrastado con fuentes primarias.'
      },
      {
        id: 'opt-2',
        text: 'Comprobar en el buscador oficial del BOE si esa Ley Orgánica y ese artículo existen en la legislación real.',
        quality: 'nuanced_correct',
        criterioScore: 100,
        feedback: '¡Matrícula de honor! Los modelos de lenguaje inventan nombres de leyes y números de artículos para complacer la premisa del usuario.'
      }
    ],
    revealedEvidence: 'Una búsqueda en el BOE demostró que la Ley Orgánica 8/2023 trata de un tema totalmente diferente y no menciona deberes escolares.',
    primarySourceName: 'Boletín Oficial del Estado (BOE)',
    primarySourceUrl: 'https://www.boe.es',
    trickExplanation: 'Alucinación y complacencia de los LLMs ante preguntas con premisas guiadas (*Sycophancy*).'
  }
];
