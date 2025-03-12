/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
let uploadedFileName = '';

function updateFileStatus(input) {
    const fileStatus = document.getElementById('fileStatus');
    if (input.files.length > 0) {
        uploadedFileName = input.files[0].name;
        fileStatus.textContent = uploadedFileName;
    } else {
        fileStatus.textContent = "No file selected";
    }
}

document.getElementById('convertJsonToXmlButton').addEventListener('click', function() {
    const inputText = document.getElementById('inputJson').value;
    if (inputText) {
        convertJsonToXml(inputText);
    } else {
        alert("Please enter valid JSON text.");
    }
});

document.getElementById('uploadJsonButton').addEventListener('click', function() {
    const fileInput = document.getElementById('jsonFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const jsonText = event.target.result;
            convertJsonToXml(jsonText);
        };
        reader.readAsText(file);
    } else {
        alert("Please choose a JSON file first.");
    }
});

function convertJsonToXml(json) {
    try {
        const obj = JSON.parse(json);
        const xml = jsonToXml(obj);
        document.getElementById('outputXml').textContent = formatXml(xml);
        document.getElementById('downloadLink').style.display = 'block';
        prepareDownload(xml);
    } catch (error) {
        alert("Invalid JSON: " + error.message);
    }
}

function jsonToXml(json, rootElement = "root") {
    let xml = `<${rootElement}>\n`;
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            const value = json[key];
            xml += (typeof value === "object") 
                ? jsonToXml(value, key) 
                : `    <${key}>${value}</${key}>\n`;
        }
    }
    xml += `</${rootElement}>\n`;
    return xml;
}

function formatXml(xml) {
    return xml.trim();
}

function prepareDownload(xml) {
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('formattedFileLink');
    
    const baseFileName = uploadedFileName.replace(/\.json$/, '');
    const newFileName = `${baseFileName}-xml-formatter.xml`;

    downloadLink.href = url;
    downloadLink.download = newFileName;
}

document.getElementById('copyButton').addEventListener('click', function() {
    const outputText = document.getElementById('outputXml').textContent;
    navigator.clipboard.writeText(outputText)
        .then(() => alert("Copied to clipboard!"))
        .catch(err => alert("Copy failed!"));
});
