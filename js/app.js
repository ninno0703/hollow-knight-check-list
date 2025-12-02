var checkboxes;

function init() {
	checkboxes = document.querySelectorAll("input[type='checkbox']");
	reloadProgress();
	countProgress();
	listenForProgress();
	updatePercentage();
	initCookieAlert();
	document.getElementsByTagName('body')[0].className = "js";
}

function reloadProgress() {
    // 改用 localStorage 讀取
	var progress = localStorage.getItem('progress');

	if(progress && progress.length){
		progress = JSON.parse(progress);

		for(var id in progress) {
			if(progress[id] == 1) {
				var el = document.querySelector("input[data-key='" + id + "']");
				
				if(el) { // 加上判斷以免找不到元素報錯
                    el.checked = true;
                }
			}
		}
	}
}

function listenForProgress() {
	for (var i = checkboxes.length - 1; i >= 0; i--) {
		checkboxes[i].addEventListener('change', function(event) {
			var id = event.target.getAttribute('id');
			saveProgress();
			countProgress();
			updatePercentage();
		});
	}

	document.getElementById("uncheckAll").addEventListener('click', function(event) {
		event.preventDefault();

		for (var i = checkboxes.length - 1; i >= 0; i--) {
			checkboxes[i].checked = false;
		}

		saveProgress();
		countProgress();
		updatePercentage();
	});
}

function saveProgress() {
	var progress = {};

	for (var i = checkboxes.length - 1; i >= 0; i--) {
		var checked = checkboxes[i].checked;
		var id = checkboxes[i].getAttribute('data-key');

		if(checked == true) {
			checked = 1;
		} else {
			checked = 0;
		}

		progress[id] = checked;
	}

    // 改用 localStorage 儲存，並將物件轉為 JSON 字串
	localStorage.setItem('progress', JSON.stringify(progress));
}

function countProgress() {
	var a = checkboxes.length;

	for (var i = checkboxes.length - 1; i >= 0; i--) {
		var checked = checkboxes[i].checked;
		var id = checkboxes[i].getAttribute('data-key');

		if(checked == true) {
			a -= 1;
		}

		document.getElementById("amountRemaining").innerHTML = a;
	}

	if(a == 0) {
		document.getElementById("congrats").style["display"] = "inline"; 
	} else {
		document.getElementById("congrats").style["display"] = ""; 
	}

	if(a < checkboxes.length) {
		document.getElementById("uncheckAll").style["display"] = "inline"; 
	} else {
		document.getElementById("uncheckAll").style["display"] = ""; 
	}
}

function initCookieAlert() {
    // 改用 localStorage 檢查是否已經關閉過提示
	var hiddenCookieAlert = localStorage.getItem('hideCookieAlert');

	if(! hiddenCookieAlert) {
		document.getElementById("hideCookieAlert").addEventListener('click', function(event) {
			event.preventDefault();
            // 改用 localStorage 記錄已關閉
			localStorage.setItem('hideCookieAlert', true);
			document.getElementById("cookieAlert").style['display'] = 'none';
		});
	} else {
		document.getElementById("cookieAlert").style['display'] = 'none';
	}
}

function updatePercentage() {
	var percent = 0;
	for (var i = checkboxes.length - 1; i >= 0; i--) {
		if(checkboxes[i].checked) {
			percent += (checkboxes[i].getAttribute('data-percent') * 1);
		}
	}

	percent = (Math.round(percent * 100) / 100);
	percentElement = document.getElementById("percent");

	percentElement.innerHTML = percent + '% <small>done</small>';
	if(percent == 112) {
		percentElement.className = "complete";
	} else {
		percentElement.className = "";
	}
}

window.onload = init();