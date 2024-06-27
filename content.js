document.addEventListener('mouseup', function (e) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    chrome.runtime.sendMessage({ action: 'showCarInfo', carName: selectedText });
  }
});
