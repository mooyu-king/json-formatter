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

document.getElementById('convertXmlToStringButton').addEventListener('click', function() {
    const inputText = document.getElementById('inputXml').value;
    if (inputText) {
        convertXmlToString(inputText);
    } else {
        alert("Please enter valid XML text.");
    }
});

document.getElementById('uploadXmlButton').addEventListener('click', function() {
    const fileInput = document.getElementById('xmlFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const xmlText = event.target.result;
            convertXmlToString(xmlText);
        };
        reader.readAsText(file);
    } else {
        alert("Please choose an XML file first.");
    }
});

document.getElementById('chooseFileButton').addEventListener('click', function() {
    document.getElementById('xmlFile').click();
});

document.getElementById('xmlFile').addEventListener('change', function(event) {
    const fileStatus = document.getElementById('fileStatus');
    if (this.files.length > 0) {
        uploadedFileName = this.files[0].name;
        fileStatus.textContent = uploadedFileName;
    } else {
        fileStatus.textContent = "No file selected";
    }
});

function convertXmlToString(xml) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const textString = flattenXml(xmlDoc.documentElement);
        document.getElementById('outputString').textContent = textString;
        document.getElementById('downloadLink').style.display = 'block';
        prepareDownload(textString);
    } catch (error) {
        alert("Invalid XML: " + error.message);
    }
}

function flattenXml(node) {
    let output = "";
    if (node.nodeType === Node.ELEMENT_NODE) {
        output += node.tagName + ": ";
        for (let i = 0; i < node.attributes.length; i++) {
            output += node.attributes[i].name + "=" + node.attributes[i].value + " ";
        }
        for (let i = 0; i < node.childNodes.length; i++) {
            output += flattenXml(node.childNodes[i]) + "; ";
        }
    } else if (node.nodeType === Node.TEXT_NODE) {
        output += node.nodeValue.trim();
    }
    return output;
}

function prepareDownload(textString) {
    const blob = new Blob([textString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('formattedFileLink');
    
    const baseFileName = uploadedFileName.replace(/\.xml$/, '');
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

