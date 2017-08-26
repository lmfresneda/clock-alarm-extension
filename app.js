// caché de nodos
const $body = $('body');
const $clock = $('#clock'), $date = $('#date');
const $inputs = $('.inputs'), $alarms = $('.alarms');
const $formNewAlarm = $('#new-alarm'), $selHour = $('input[name="hour-config"]'), $selMinutes = $('input[name="minutes-config"]');
const $alarmConfig = $('#alarm-config');
const $errorFormConfig = $('#error-form-config');
const $rangeSizeClock = $('#range-size-clock');

// formatos
const formatTime = 'HH:mm:ss';
const formatTimeAlarm = 'HH:mm';
const formatDate = 'ddd, D MMMM YYYY';

// caché colores del body
var bodyBackColor = '#008348', bodyFontColor = '#E2E2E2';

let countAnimate = 0;

// se llama cada segundo para pintar la hora
const interClock = setInterval(() => {
	$clock.html(moment().format(formatTime));
}, 1000);
// se llama cada minuto para pintar la fecha
const interDate = setInterval(() => {
	$date.html(moment().format(formatDate))
}, 1000 * 60);
// se llama cada 6 segundos para comprobar si hay alarma
const interAlarm = setInterval(() => {
	const m = moment();
	intervalHour(m);
}, 5000);
$clock.html(moment().format(formatTime));
$date.html(moment().format(formatDate));

// comprueba si hay alarmas que lanzar en la fecha recibida
function intervalHour(dateMoment, test){
	const hora = dateMoment.format(formatTimeAlarm);
	const segundos = dateMoment.format(`ss`);
	if(!test && parseInt(segundos) > 5) return;
	const alarms = getAlarmsStorage();
	if(alarms.includes(hora) || test){
		if(isSound()){
			var audio = new Audio('res/alarm-sound.mp3');
			audio.play();
			setTimeout(() => audio.pause(), 5000);
		}
		animateBody();
		sendNotification(hora);
	}
}

// realiza la animación de colores cuando salta la alarma
function animateBody(){
	if(countAnimate >= 5) {
		countAnimate = 0;
		$body.css('background-color', localStorage.color);
		$body.css('color', bodyFontColor);
		return;
	}
	countAnimate += 1;
	$body.css('background-color', 'red');
	$body.css('color', 'white');
	setTimeout(() => {
		$body.css('background-color', 'yellow');
		$body.css('color', 'black');
		setTimeout(() => {
			animateBody();
		}, 500);
	}, 500);
}

// indica si se debe escuchar el sonido de alarma
function isSound(){
	return localStorage.sound === undefined || localStorage.sound === 'true';
}

// pinta todas las alarmas en el config
function printAllAlarms(){
	$('.alarm').remove();
	const alarms = getAlarmsStorage();
	alarms.sort().forEach(printNewAlarmConfig);
}
printAllAlarms();

// pinta una nueva alarma en el config
function printNewAlarmConfig(alarm){
	$alarms.append(`<span class='alarm' title="${chrome.i18n.getMessage('title_alarm_remove')}">${alarm}</span>`)
}

// guarda una nueva alarma
function newAlarm(alarm){
	const alarms = getAlarmsStorage();
	if(!alarms.includes(alarm)) {
		setAlarmStorage(alarm);
		printAllAlarms();
	}
}

// recoge los datos del formulario para una nueva alarma
$formNewAlarm.submit((e) => {
	e.preventDefault();
	const hour = $selHour.val(), min = $selMinutes.val();
	if(hour && min && validaHora(hour) && validaMinuto(min)){
		newAlarm(`${convertToDigits(hour)}:${convertToDigits(min)}`);
	}else{
		$errorFormConfig.show();
		setTimeout(() => $errorFormConfig.hide(), 1000);
	}
});
function validaHora(hora){
	if(isNaN(hora)) return false;
	if(parseInt(hora) > 23 || parseInt(hora) < 0) return false;
	return true;
}
function validaMinuto(minuto){
	if(isNaN(minuto)) return false;
	if(parseInt(minuto) > 59 || parseInt(minuto) < 0) return false;
	return true;
}

// elimina una alarma al hacer click en ella
$(document).on('click', '.alarm', function(e) {
	removeAlarmStorage($(this).html());
	printAllAlarms();
});

// inicializa el formulario de configuración
function initFormConfig(){
	
}
initFormConfig();

// inicializa el localStorage con un array vacío y el color de fondo
function initLocalStorage(){
	if(!localStorage.alarms) localStorage.alarms = "[]";
	if(!localStorage.color) localStorage.color = "#008348";
	if(!localStorage.size) localStorage.size = "91";
}
initLocalStorage();

// devuelve las alarmas guardadas en localStorage parseadas
function getAlarmsStorage(){
	initLocalStorage();
	return JSON.parse(localStorage.alarms);
}
// inserta una neva alarma en el localStorage y las devuelve parseadas
function setAlarmStorage(alarm){
	const alarms = getAlarmsStorage();
	alarms.push(alarm);
	localStorage.alarms = JSON.stringify(alarms);
	return alarms;
}
// borra una alarma
function removeAlarmStorage(alarm){
	const alarms = getAlarmsStorage().filter(alarmStorage => alarmStorage != alarm);
	localStorage.alarms = JSON.stringify(alarms);
	return alarms;
}

// convierte un número a dos dígitos si es necesario
function convertToDigits(num){
	return parseInt(num) < 10 ? `0${parseInt(num)}` : parseInt(num);
}

$('#info-page, #clock, #date, #close-config').click(hideConfig);
$('#open-config').click(showConfig);

// muestra el panel de configuración
function showConfig(){
	$alarmConfig.animate({
		left: 0
	}, 'fast');
}
// oculta el panel de configuración
function hideConfig(){
	$alarmConfig.animate({
		left: -350
	}, 'fast');
}

// inicializa los textos con i18n
function initLocale(){
	const title = chrome.i18n.getMessage('title');
	const configuration = chrome.i18n.getMessage('configuration');
	const close = chrome.i18n.getMessage('close');
	const hour = chrome.i18n.getMessage('hour');
	const minutes = chrome.i18n.getMessage('minutes');
	const saveNewAlarm = chrome.i18n.getMessage('save_new_alarm');
	const configNewAlarm = chrome.i18n.getMessage('config_new_alarm');
	const textConfigNewAlarm = chrome.i18n.getMessage('text_config_new_alarm');
	const configuredAlarms = chrome.i18n.getMessage('configured_alarms');
	const errorSaveAlarm = chrome.i18n.getMessage('error_save_alarm');
	const selectColor = chrome.i18n.getMessage('select_color');

	$('title').html(title);
	$('#open-config').html(configuration);
	$('#close-config').html(close);
	$('label[for="hour-config"]').html(hour);
	$('label[for="minutes-config"]').html(minutes);
	$('input[name="send-alarm"]').val(saveNewAlarm);
	$('#config-new-alarm').html(`${configNewAlarm}:`);
	$('#text-config-hour').html(`(${textConfigNewAlarm})`);
	$('#alarms-configured').html(`${configuredAlarms}:`);
	$('#error-form-config').html(errorSaveAlarm);
	$('#select-color').html(`${selectColor}:`);
}
initLocale();

// lanza una alarma de test
$('#test-alarm').click(function(){
	hideConfig();
	intervalHour(moment(), true);
});

// envía una notificación nativa
function sendNotification(text){
	if(isNotificable()){
		var noti = new Notification(
		  chrome.i18n.getMessage('title_alarm'), 
		  {
	      icon: 'res/img/icon64.png',
	      body: chrome.i18n.getMessage('text_alarm', [text]),
    });
    noti.onclick = function(){
    	noti.close();
    }
    setTimeout(noti.close.bind(noti), 5000);
	}
}

// indica si se puede enviar una notificación nativa
function isNotificable(){
	return Notification && Notification.permission === 'granted';
}

// revisa que exista el objeto Notification y pide los permisos en caso necesario
function initNotifications(){
	if (!Notification) {
    console.error('Desktop notifications not available in your browser.'); 
    return;
  }

  if (Notification.permission === "default")
    Notification.requestPermission();
}
initNotifications();

function initColors(){
	['#008348', '#01A9DB', '#0000FF', '#B404AE', 
	'#FF0040', '#FF4000', '#DBA901', '#FA5858',
	'#688A08', '#B40431', '#424242', '#1C1C1C'].forEach((color) => {
		$('.colors').append('<div style="background-color: '+ color +'" data-color="'+ color +'"></div>');
	});
	selectColor();
}
initColors();

function selectColor(){
	if(localStorage.color){
		$('.colors > div').removeClass('color-selected');
		$('*[data-color="'+ localStorage.color +'"]').addClass('color-selected');
		$body.css('background-color', localStorage.color);
	}
}
$('.colors > div').click(function() {
	localStorage.color = $(this).data('color');
	selectColor();
});

// modifica el size de la fuente del reloj y la fecha
function resizeFontClock(){
	const val = parseInt($rangeSizeClock.val());
	const sizeClock = 23 / 100 * val;
	const sizeDate = 6 / 100 * val;
	$clock.css('font-size', sizeClock + 'vw');
	$date.css('font-size', sizeDate + 'vw');
	localStorage.size = val;
}
$rangeSizeClock.off().change(resizeFontClock);
$rangeSizeClock.mousemove(resizeFontClock);
$rangeSizeClock.val(localStorage.size);
resizeFontClock();