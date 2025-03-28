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

document.getElementById('convertJsonToStringButton').addEventListener('click', function() {
    const inputText = document.getElementById('inputJson').value;
    if (inputText) {
        convertJsonToString(inputText);
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
            convertJsonToString(jsonText);
        };
        reader.readAsText(file);
    } else {
        alert("Please choose a JSON file first.");
    }
});

function convertJsonToString(json) {
    try {
        const obj = JSON.parse(json);
        const textString = flattenJson(obj);
        document.getElementById('outputString').textContent = textString;
        document.getElementById('downloadLink').style.display = 'block';
        prepareDownload(textString);
    } catch (error) {
        alert("Invalid JSON: " + error.message);
    }
}

function flattenJson(obj) {
    let output = "";
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            output += `${key}: ${typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]}; `;
        }
    }
    return output;
}

function prepareDownload(textString) {
    const blob = new Blob([textString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('formattedFileLink');
    
    const baseFileName = uploadedFileName.replace(/\.json$/, '');
    const newFileName = `${baseFileName}-string.txt`;

    downloadLink.href = url;
    downloadLink.download = newFileName;
}

document.getElementById('copyButton').addEventListener('click', function() {
    const outputText = document.getElementById('outputString').textContent;
    navigator.clipboard.writeText(outputText)
        .then(() => alert("Copied to clipboard!"))
        .catch(err => alert("Copy failed!"));
});

