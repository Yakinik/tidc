const Zlib = require('./lib/unzip.min').Zlib;
const path = require('path');
const mime = require('mime-types');
const { link } = require('fs');

const decoder = new TextDecoder();

const composedConfiguration = {
  configurations: []
};

const baseConfiguration = {
  delay: 0,
  isRgx: false,
  label: '',
  method: 'GET',
  requestPayload: '',
  responseHeaders: [
    {
      active: true,
      header: 'Content-Type',
      id: '',
      value: ''
    }
  ],
  responsePayload: '',
  status: 200,
  url: ''
};

document.addEventListener('DOMContentLoaded', () => {
  const domainForm = document.getElementById('domain_input');
  const fileForm = document.getElementById('file_input');
  const outputForm = document.getElementById('output');
  const saveJsonButton = document.getElementById('save_json');

  const zipReader = new FileReader();

  let isFileExist = false;
  let timeoutId = 0;

  const domainCookieMatch = document.cookie.match(/tidcDomain=([^;]+)(;|$)/);

  if (domainCookieMatch) {
    domainForm.value = domainCookieMatch[1];
  }

  function rebuildJson() {
    if (!isFileExist) return;

    const zipArr = new Uint8Array(zipReader.result);
    const unzip = new Zlib.Unzip(zipArr);
    const filePathListRaw = unzip.getFilenames();
    const filePathList = filePathListRaw.filter((path) => !path.match(/\/$|__MACOSX|\.DS_Store|\.Thumbs.db/));

    filePathList.forEach((filePath) => {
      const configuration = { ...baseConfiguration };
      const urlPath = filePath;
      configuration.url = `${domainForm.value}/${urlPath}`;
      configuration.responseHeaders[0].value = mime.contentType(path.basename(filePath));
      configuration.responsePayload = decoder.decode(unzip.decompress(filePath));
      composedConfiguration.configurations.push(configuration);
    });

    outputForm.value = JSON.stringify(composedConfiguration, 'null', '  ');
    saveJsonButton.disabled = false;
  }

  domainForm.addEventListener('keydown', () => {
    let date = new Date();
    date.setMonth(date.getMonth() + 3);
    document.cookie = `tidcDomain=${domainForm.value};path=/;expires=${date.toUTCString()}`;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      rebuildJson();
    }, 1000);
  });

  fileForm.addEventListener('change', () => {
    const file = fileForm.files[0];

    zipReader.onload = function () {
      isFileExist = true;
      rebuildJson();
    };
    zipReader.readAsArrayBuffer(file);
  });

  saveJsonButton.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(composedConfiguration)], { type: 'application/json' });
    const dummyElement = document.createElement('a');
    dummyElement.download = 'import.json';
    dummyElement.href = URL.createObjectURL(blob);
    dummyElement.click();
    URL.revokeObjectURL(dummyElement.href);
  });
});
