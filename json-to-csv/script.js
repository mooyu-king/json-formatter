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

document.getElementById('convertJsonToCsvButton').addEventListener('click', function() {
    const inputText = document.getElementById('inputJson').value;
    if (inputText) {
        convertJsonToCsv(inputText);
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
            convertJsonToCsv(jsonText);
        };
        reader.readAsText(file);
    } else {
        alert("Please choose a JSON file first.");
    }
});

function convertJsonToCsv(json) {
    try {
        const obj = JSON.parse(json);
        const csv = jsonToCsv(obj);
        document.getElementById('outputCsv').textContent = csv; // 输出CSV文本
        document.getElementById('downloadLink').style.display = 'block'; // 显示下载链接
        prepareDownload(csv); // 准备下载链接
    } catch (error) {
        alert("Invalid JSON: " + error.message);
    }
}

function jsonToCsv(json) {
    const rows = [];
    const keys = Object.keys(json[0]); // 假设 JSON 是一个数组

    // 添加头行
    rows.push(keys.join(','));

    // 添加每一行数据
    json.forEach(item => {
        const values = keys.map(key => item[key]);
        rows.push(values.join(','));
    });

    return rows.join('\n');
}

function prepareDownload(csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('formattedFileLink');

    const baseFileName = uploadedFileName.replace(/\.json$/, '');
    const newFileName = `${baseFileName}-csv-formatter.csv`; // 修改为CSV文件名

    downloadLink.href = url;
    downloadLink.download = newFileName; // 设置下载文件名
}

document.getElementById('copyButton').addEventListener('click', function() {
    const outputText = document.getElementById('outputCsv').textContent; // 复制 CSV 文本
    navigator.clipboard.writeText(outputText)
        .then(() => alert("Copied to clipboard!"))
        .catch(err => alert("Copy failed!"));
});
