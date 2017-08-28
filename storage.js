// inicializa el localStorage con un array vacío y el color de fondo
function initLocalStorage(){
	if(!localStorage.alarms) localStorage.alarms = "[]";
	if(!localStorage.calls) localStorage.calls = "{}";
	if(!localStorage.urls) localStorage.urls = "{}";
	if(!localStorage.color) localStorage.color = "#008348";
	if(!localStorage.size) localStorage.size = "91";
}
initLocalStorage();

// devuelve una url guardadas en localStorage, si no existe, devuelve undefined
function getUrlStorage(hour){
	const urls = getUrlsStorage();
	return urls[hour];
}
// devuelve las urls guardadas en localStorage parseadas
function getUrlsStorage(){
	return JSON.parse(localStorage.urls);
}
// inserta una nueva url en el localStorage y las devuelve parseadas
function setUrlsStorage(hour, url){
	const urls = getUrlsStorage();
	urls[hour] = url;
	localStorage.urls = JSON.stringify(urls);
	return urls;
}
// borra una url
function removeUrlStorage(hour){
	const urls = getUrlsStorage();
	delete urls[hour];
	localStorage.urls = JSON.stringify(urls);
	return urls;
}

// devuelve las alarmas guardadas en localStorage parseadas
function getAlarmsStorage(){
	return JSON.parse(localStorage.alarms);
}
// inserta una neva alarma en el localStorage y las devuelve parseadas
function setAlarmStorage(alarm, url){
	const alarms = getAlarmsStorage();
	alarms.push(alarm);
	localStorage.alarms = JSON.stringify(alarms);
	if(url) setUrlsStorage(alarm, url);
	return alarms;
}
// borra una alarma
function removeAlarmStorage(alarm){
	const alarms = getAlarmsStorage().filter(alarmStorage => alarmStorage != alarm);
	localStorage.alarms = JSON.stringify(alarms);
	removeUrlStorage(alarm);
	removeCalledAlarm(alarm);
	return alarms;
}

// guarda una nueva alarma
function newAlarm(alarm, url){
	const alarms = getAlarmsStorage();
	if(!alarms.includes(alarm)) {
		setAlarmStorage(alarm);
		if(url) setUrlsStorage(alarm, url);
		printAllAlarms();
	}
}

// indica si se debe escuchar el sonido de alarma
function isSound(){
	return localStorage.sound === undefined || localStorage.sound === 'true';
}

function setColorStorage(color) {
	localStorage.color = color;
}
function getColorStorage() {
	return localStorage.color;
}

function setSizeStorage(size) {
	localStorage.size = size;
}
function getSizeStorage() {
	return localStorage.size;
}

function isCalledAlarm(alarm) {
	var calls = JSON.parse(localStorage.calls);
	return calls[alarm] && calls[alarm] == moment().format('DDMMYYYY');
}
function setCalledAlarm(alarm) {
	var calls = JSON.parse(localStorage.calls);
	calls[alarm] = moment().format('DDMMYYYY');
	localStorage.calls = JSON.stringify(calls);
}
function removeCalledAlarm(alarm) {
	var calls = JSON.parse(localStorage.calls);
	delete calls[alarm];
	localStorage.calls = JSON.stringify(calls);
}