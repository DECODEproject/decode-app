/*
 * DECODE App – A mobile app to control your personal data
 *
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: info@dribia.com
 */

export default {
  translation: {
    back: 'Atrás',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    greeting: 'Esta es la app DECODE v2',
    home: 'Inicio',
    next: 'Siguiente',
    refreshStats: 'Actualizar estadísticas del credential issuer',
    refresh: 'Actualizar',
    total: 'Total',
    refreshDate: 'Actualizado el {{date, llll}}',
    second: 'Otra pantalla',
    walkthrough: {
      refresh: 'Se llamará a la API del credential issuer',
      next: 'Clicar aquí para ir a otra pantalla',
      crash: 'Clicar aquí para provocar un casque',
    },
  },
  carousel: {
    title: 'DECODE',
    txt1: 'tu gestor de datos personales',
    txt2: 'Tus datos tienen un valor. Es importante que los controles',
    txt3: 'Con DECODE, tú decides qué datos quieres compartir y cómo son utilizados',
    txt4: 'Guarda tus datos personales con alta seguridad',
    done: 'Hecho',
    skip: 'Saltar',
    next: 'Siguiente',
  },
  attributes: {
    add: 'Añadir atributo',
    available: 'Atributos disponibles',
    confirmDelete: '¿Seguro que quieres borrar {{ name }}?',
    my: 'Mis atributos',
    empty: 'Empecemos por añadir algunos datos.\nHaz click en el botón inferior para empezar',
    emptyAtlas: 'Ya tienes un valor para todos los datos posibles.',
    enterValue: 'Introduce un valor',
    save: 'Guardar',
  },
  applications: {
    activate: 'Activar servicio vía QR',
    available: 'Aplicaciones',
    averageUse: 'Promedio',
    cancel: 'Cancelar',
    certificateRequestButton: 'Obtener certificado',
    certificateRequired: 'Para firmar necesitas que te sea emitido un certificado',
    certificates: 'Certificados',
    day: 'día',
    empty: 'No hay aplicaciones disponibles',
    error: 'Tu petición no se ha podido procesar',
    firstUse: 'Primer uso',
    history: 'Historial de uso',
    lastUse: 'Último uso',
    manageData: 'Gestionar mis datos',
    month: 'mes',
    more: '+ información',
    sharedData: 'Datos compartidos',
    times: '1 vez por {{ unit }}',
    times_interval: '(0){Menos de una vez por {{ unit }}};(1-inf){{{ count }} veces por {{ unit }}}',
    times_plural: '{{ count }} veces por {{ unit }}',
    usageCount: 'Usos',
    week: 'semana',
    year: 'año',
  },
  settings: {
    title: 'Preferencias',
    review: 'Revisar ayudas',
    reset: 'Borrar todo',
    warning: 'Estás a punto de borrar toda la memoria de la app (datos, certificados,...)\n\n'
    + 'Este paso no tiene vuelta atrás.\n\n'
    + 'Deseas continuar?\n',
  },
  about: {
    title: 'Información',
    text1: 'La app de DECODE forma parte de un proyecto para retornar la <b>soberanía de datos</b> a los ciudadanos y ciudadanas',
    text2: 'Con la app de DECODE puedes <b>compartir tus datos</b> con las <b>aplicaciones compatibles</b> mediante <b>certificados criptográficos</b> de última generación',
    more: 'Quiero más información!',
  },
  scanner: {
    title: 'Escáner QR',
    error: 'No se ha podido interpretar el código QR',
  },
};
