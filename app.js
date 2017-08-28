// caché de nodos
const $body = $('body');
const $clock = $('#clock'), $date = $('#date');
const $inputs = $('.inputs'), $alarms = $('.alarms');
const $formNewAlarm = $('#new-alarm'), 
			$selHour = $('input[name="hour-config"]'), 
			$selMinutes = $('input[name="minutes-config"]'),
			$selUrl = $('input[name="url-config"]');
const $alarmConfig = $('#alarm-config');
const $errorFormConfig = $('#error-form-config');
const $errorUrlConfig = $('#error-url-config');
const $rangeSizeClock = $('#range-size-clock');
const urlRegEx = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

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
// se llama cada 10 segundos para comprobar si hay alarma
const interAlarm = setInterval(() => {
	const m = moment();
	intervalHour(m);
}, 10000);
$clock.html(moment().format(formatTime));
$date.html(moment().format(formatDate));

// comprueba si hay alarmas que lanzar en la fecha recibida
function intervalHour(dateMoment, test){
	const hora = dateMoment.format(formatTimeAlarm);
	const alarms = getAlarmsStorage();
	if(alarms.includes(hora) || test){
		console.log('llamado: ', hora)
		if(!test && isCalledAlarm(hora)) return;
		if(!test) setCalledAlarm(hora);
		if(isSound()){
			var audio = new Audio('res/alarm-sound.mp3');
			audio.play();
			setTimeout(() => audio.pause(), 5000);
		}

		sendNotification(hora);
		animateBody(() => {
			const url = getUrlStorage(hora);
			if(url || test){
				browser.tabs.create({url: test ? 'https://addons.mozilla.org/es/firefox/addon/alarms-clock' : url})
					.then((ok) => {}).catch((err) => {console.log(err)});
			}
		});
	}
}

// realiza la animación de colores cuando salta la alarma
function animateBody(callback){
	if(countAnimate >= 5) {
		countAnimate = 0;
		$body.css('background-color', localStorage.color);
		$body.css('color', bodyFontColor);
		if(callback) callback();
		return;
	}
	countAnimate += 1;
	$body.css('background-color', 'red');
	$body.css('color', 'white');
	setTimeout(() => {
		$body.css('background-color', 'yellow');
		$body.css('color', 'black');
		setTimeout(() => {
			animateBody(callback);
		}, 500);
	}, 500);
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
	$alarms.append(`<span class='alarm' title="${chrome.i18n.getMessage('title_alarm_remove')} ${getUrlStorage(alarm) ? '('+ getUrlStorage(alarm) +')' : ''}">${alarm}</span>`)
}

// recoge los datos del formulario para una nueva alarma
$formNewAlarm.submit((e) => {
	e.preventDefault();
	const hour = $selHour.val(), min = $selMinutes.val(), url = $selUrl.val();
	if(hour && min && validaHora(hour) && validaMinuto(min)){
		if(url && !urlRegEx.test(url)){
			$errorUrlConfig.show();
			setTimeout(() => $errorUrlConfig.hide(), 1000);
			return;
		}
		newAlarm(`${convertToDigits(hour)}:${convertToDigits(min)}`, url);
		$selHour.val('');
		$selMinutes.val('');
		$selUrl.val('');
	}else{
		$errorFormConfig.show();
		setTimeout(() => $errorFormConfig.hide(), 1000);
	}
});

// elimina una alarma al hacer click en ella
$(document).on('click', '.alarm', function(e) {
	removeAlarmStorage($(this).html());
	printAllAlarms();
});

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

// lanza una alarma de test
$('#test-alarm').click(function(){
	hideConfig();
	intervalHour(moment(), true);
});

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
	if(getColorStorage()){
		$('.colors > div').removeClass('color-selected');
		$('*[data-color="'+ getColorStorage() +'"]').addClass('color-selected');
		$body.css('background-color', getColorStorage());
	}
}
$('.colors > div').click(function() {
	setColorStorage($(this).data('color'));
	selectColor();
});

// modifica el size de la fuente del reloj y la fecha
function resizeFontClock(){
	const val = parseInt($rangeSizeClock.val());
	const sizeClock = 23 / 100 * val;
	const sizeDate = 6 / 100 * val;
	$clock.css('font-size', sizeClock + 'vw');
	$date.css('font-size', sizeDate + 'vw');
	setSizeStorage(val)
}
$rangeSizeClock.off().change(resizeFontClock);
$rangeSizeClock.mousemove(resizeFontClock);
$rangeSizeClock.val(getSizeStorage());
resizeFontClock();