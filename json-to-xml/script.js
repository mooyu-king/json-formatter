/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
let uploadedFileName = ''; // 用于存储上传的文件名

function updateFileStatus(input) {
    const fileStatus = document.getElementById('fileStatus');
    if (input.files.length > 0) {
        uploadedFileName = input.files[0].name; // 记录上传文件的名称
        fileStatus.textContent = uploadedFileName; // 显示选中文件的名称
    } else {
        fileStatus.textContent = "No file selected"; // 如果没有选择文件
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

// 在上传文件时，读取并转换 JSON
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
        document.getElementById('downloadLink').style.display = 'block'; // 显示下载链接
        prepareDownload(xml); // 准备下载链接
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
    return xml.trim(); // 可以添加更多复杂的格式化逻辑
}

function prepareDownload(xml) {
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('formattedFileLink');
    
    // 获取基本文件名，并替换扩展名
    const baseFileName = uploadedFileName.replace(/\.json$/, ''); // 去掉.json后缀
    const newFileName = `${baseFileName}-xml-formatter.xml`; // 创建新的文件名

    downloadLink.href = url; // 设置下载链接的 URL
    downloadLink.download = newFileName; // 设置下载文件名
}

document.getElementById('copyButton').addEventListener('click', function() {
    const outputText = document.getElementById('outputXml').textContent;
    navigator.clipboard.writeText(outputText)
        .then(() => alert("Copied to clipboard!"))
        .catch(err => alert("Copy failed!"));
});
