chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for Bing search
  chrome.contextMenus.create({
    id: 'highlightSearch',
    title: 'Check Reliability of "%s" on Bing',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'highlightSearch') {
    const queryCC = `carcomplaints.com ${info.selectionText}`;
    chrome.tabs.create({
      url: 'https://www.bing.com/search?q=' + encodeURIComponent(queryCC),
      index: tab.index + 1,
    });
    const query = `how many miles will a ${info.selectionText} last?`;
    chrome.tabs.create({
      url: 'https://www.bing.com/search?q=' + encodeURIComponent(query),
      index: tab.index + 2,
    });
  }
});
