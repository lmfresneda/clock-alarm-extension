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