// Step 1: Define the context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'showCarInfoMenu',
    title: 'Show Car Info',
    contexts: ['selection'],
  });
});

// Step 2: Add a listener for the context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'showCarInfoMenu' && info.selectionText) {
    // Assuming you have a function to fetch or determine the average miles
    // For demonstration, using a static value
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectCarInfoPopup,
      args: [info.selectionText],
    });
  }
});

function injectCarInfoPopup(carName) {
  // Inject CSS styles
  const style = document.createElement('style');
  style.innerHTML = `
  #car-info-popup {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    width: 90vw;
    height: 90vh;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    z-index: 11111111111111110;
  }

  #car-info-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 121212121212;
  }

  #innerDiv{
      font-size: 14px;
    color: #333;
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 90%;
    padding: 10px;
}

#tab-container{
display: flex;
justify-content:center;
gap: 10px;
padding: 10px;
}
#tab-container button{

    padding: 5px 10px;
    cursor: pointer;
    border: solid 1px #007bff;
    color: #007bff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
    border-radius:9999px
}



  #content-container {
    width: 100%;
    height: 100%;
  }

  #closePopup{
    max-width: 200px;
    width: 100%;
    margin: auto;
    padding: 10px;
    border: none;
    background-color: #007bff;
    text-align: center;
    color: white;
    cursor: pointer;
    border-radius: 999px;
    box-shadow: 0px 0px 4px rgba(0,
  }
`;
  document.head.appendChild(style);

  const backdropId = 'car-info-backdrop';
  let backdrop = document.getElementById(backdropId);
  // Remove existing backdrop if it exists
  if (backdrop) {
    backdrop.remove();
  }

  // Create new backdrop
  backdrop = document.createElement('div');
  backdrop.id = backdropId;

  document.body.appendChild(backdrop);

  const popupId = 'car-info-popup';
  let popup = document.getElementById(popupId);

  // Remove existing popup if it exists
  if (popup) {
    popup.remove();
  }

  // Create new popup
  popup = document.createElement('div');
  popup.id = popupId;

  popup.innerHTML = `
  <div id="innerDiv">  
  </div>
  <button id="closePopup">Close</button>
  `;

  document.body.appendChild(popup);

  const querys = [
    {
      name: 'Expected Miles',
      before: 'how many miles will a ',
      after: ' last??',
      searchEngine: 'https://www.bing.com/search?q=',
    },
    {
      name: 'CarComplaints.com',
      before: 'carcomplaints.com ',
      after: '',
      searchEngine: 'https://www.bing.com/search?q=',
    },
    {
      name: 'Kelly Blue Book',
      before: 'kelley blue book ',
      after: ' price, reviews',
      searchEngine: 'https://www.bing.com/search?q=',
    },
  ];

  // Create tab and content containers
  const tabContainer = document.createElement('div');
  tabContainer.id = 'tab-container';
  const contentContainer = document.createElement('div');
  contentContainer.id = 'content-container';

  querys.forEach((query, index) => {
    // Create a tab for each query
    const tab = document.createElement('button');
    tab.textContent = query.name; // Assuming each query has a 'name' property
    tab.id = `tab-${index}`;
    tab.className = 'tab';
    tabContainer.appendChild(tab);

    // Create an iframe for each query
    const iframe = document.createElement('iframe');
    iframe.src = `${query.searchEngine}${encodeURIComponent(query.before + carName + query.after)}`;
    iframe.style = `width: 100%; height: 100%; display: ${index === 0 ? 'block' : 'none'};`;
    iframe.id = `content-${index}`;
    contentContainer.appendChild(iframe);

    // Add click event listener to each tab
    tab.addEventListener('click', () => {
      document.querySelectorAll('#content-container iframe').forEach((frame, frameIndex) => {
        frame.style.display = frameIndex === index ? 'block' : 'none'; // Show the clicked tab's content, hide others
      });
    });
  });

  // Append the tab and content containers to the popup
  popup.querySelector('div').appendChild(tabContainer);
  popup.querySelector('div').appendChild(contentContainer);
  // Close button functionality
  document.getElementById('closePopup').addEventListener('click', function () {
    popup.remove();
    backdrop.remove();
  });
  document.getElementById('car-info-backdrop').addEventListener('click', function () {
    popup.remove();
    backdrop.remove();
  });
}
