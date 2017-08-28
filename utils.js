// convierte un número a dos dígitos si es necesario
function convertToDigits(num){
	return parseInt(num) < 10 ? `0${parseInt(num)}` : parseInt(num);
}

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
	const placeholderUrlInput = chrome.i18n.getMessage('placeholder_url_input');

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
	$('input[name="url-config"]').attr('placeholder', placeholderUrlInput);
}
initLocale();