function initLocale(){
	const textSoundAlarm = chrome.i18n.getMessage('text_sound_alarm');
	const configuration = chrome.i18n.getMessage('configuration');

	$('title').html(configuration);
	$('#text-sound-alarm').html(textSoundAlarm);
}
initLocale();

function sound(is){
	localStorage.sound = is.toString();
}
if(!localStorage.sound) sound(true);

$('#sound-switch').off().click(function(){
	sound($(this).is(':checked'));
});

$('#sound-switch').prop('checked', localStorage.sound == 'true');

