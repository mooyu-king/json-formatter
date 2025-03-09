/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
const translations = {
    zh: {
        inputTitle: "输入 JSON 文本",
        uploadTitle: "上传 JSON 文件",
        outputTitle: "格式化后的 JSON 文本",
        formatJsonButton: "格式化 JSON",
        uploadJsonButton: "上传并格式化",
        copyButton: "一键复制",
        downloadText: "下载格式化后的文件：",
        invalidJson: "无效的 JSON 文件",
        copied: "已复制到剪贴板！",
        copyFailed: "复制失败！",
        noFileSelected: "未选择文件",
        chooseFile: "选择文件",
    },
    en: {
        inputTitle: "Input JSON Text",
        uploadTitle: "Upload JSON File",
        outputTitle: "Formatted JSON Text",
        formatJsonButton: "Format JSON",
        uploadJsonButton: "Upload and Format",
        copyButton: "Copy to Clipboard",
        downloadText: "Download formatted file:",
        invalidJson: "Invalid JSON file",
        copied: "Copied to clipboard!",
        copyFailed: "Copy failed!",
        noFileSelected: "No file selected",
        chooseFile: "Choose File",
    },
    ar: {
        inputTitle: "أدخل نص JSON",
        uploadTitle: "رفع ملف JSON",
        outputTitle: "نص JSON المنسق",
        formatJsonButton: "تنسيق JSON",
        uploadJsonButton: "رفع وتنسيق",
        copyButton: "نسخ إلى الحافظة",
        downloadText: "تحميل الملف المنسق:",
        invalidJson: "ملف JSON غير صالح",
        copied: "تم النسخ إلى الحافظة!",
        copyFailed: "فشل النسخ!",
        noFileSelected: "لم يتم اختيار ملف",
        chooseFile: "اختر ملف",
    }
};

document.getElementById('language').addEventListener('change', function() {
    const lang = this.value;
    updateLanguage(lang);
});

updateLanguage('en');

function updateLanguage(lang) {
    document.getElementById('inputTitle').textContent = translations[lang].inputTitle;
    document.getElementById('uploadTitle').textContent = translations[lang].uploadTitle;
    document.getElementById('outputTitle').textContent = translations[lang].outputTitle;
    document.getElementById('formatJsonButton').textContent = translations[lang].formatJsonButton;
    document.getElementById('uploadJsonButton').textContent = translations[lang].uploadJsonButton;
    document.getElementById('copyButton').textContent = translations[lang].copyButton;
    document.getElementById('downloadText').textContent = translations[lang].downloadText;
    document.getElementById('fileStatus').textContent = translations[lang].noFileSelected;
    document.getElementById('fileLabel').textContent = translations[lang].chooseFile;
}

document.getElementById('formatJsonButton').addEventListener('click', formatJson);
document.getElementById('inputJson').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        formatJson();
    }
});

document.getElementById('jsonFile').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : '';
    document.getElementById('fileStatus').textContent = fileName ? fileName : translations[document.getElementById('language').value].noFileSelected;
});

document.getElementById('uploadJsonButton').addEventListener('click', function() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            validateAndFormatJson(event.target.result, file.name);
        };
        reader.readAsText(file);
    } else {
        alert(translations[document.getElementById('language').value].noFileSelected);
    }
});

document.getElementById('copyButton').addEventListener('click', function() {
    const outputText = document.getElementById('outputJson').textContent;
    navigator.clipboard.writeText(outputText)
        .then(() => {
            alert(translations[document.getElementById('language').value].copied);
        })
        .catch(err => {
            alert(translations[document.getElementById('language').value].copyFailed);
        });
});


////////////////////////

function formatJson() {
    const inputText = document.getElementById('inputJson').value;
    validateAndFormatJson(inputText);
}

function validateAndFormatJson(inputText, fileName = '') {
    try {
        const json = JSON.parse(inputText);
        const formattedJson = JSON.stringify(json, null, 4);
        document.getElementById('outputJson').textContent = formattedJson;
        document.getElementById('inputJson').classList.remove('error');
        clearErrorHighlight();
        if (fileName) {
            showDownloadLink(formattedJson, fileName);
        }
    } catch (error) {
        document.getElementById('inputJson').classList.add('error');
        highlightError(inputText, error);
        alert(translations[document.getElementById('language').value].invalidJson);
    }
}

function highlightError(inputText, error) {
    const errorLocation = error.message.match(/at line (\d+) column (\d+)/);
    if (errorLocation && errorLocation.length === 3) {
        const line = parseInt(errorLocation[1], 10);
        const column = parseInt(errorLocation[2], 10);

        const lines = inputText.split('\n');
        if (line <= lines.length) {
            const errorLine = lines[line - 1];
            const position = errorLine.slice(0, column - 1) + '<span style="color:red;">' + errorLine.charAt(column - 1) + '</span>' + errorLine.slice(column);
            lines[line - 1] = position;
            document.getElementById('inputJson').innerHTML = lines.join('\n');

            const textarea = document.getElementById('inputJson');
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            blinkCursor(textarea, line, column);
        }
    }
}

function blinkCursor(textarea, line, column) {
    const originalValue = textarea.value;
    let currentLine = 0;
    let currentCol = 0;
    const interval = setInterval(() => {
        const value = textarea.value;
        if (value === originalValue) {
            const lines = value.split('\n');
            if (currentLine < lines.length) {
                if (currentCol < lines[currentLine].length) {
                    currentCol++;
                } else {
                    currentLine++;
                    currentCol = 0;
                }
                if (currentLine === line - 1 && currentCol === column - 1) {
                    textarea.style.borderColor = textarea.style.borderColor === 'red' ? '' : 'red';
                }
            } else {
                clearInterval(interval);
                textarea.style.borderColor = '';
                alert(translations[document.getElementById('language').value].invalidJson);
            }
        } else {
            clearInterval(interval);
        }
    }, 500);
}

function clearErrorHighlight() {
    const textarea = document.getElementById('inputJson');
    textarea.classList.remove('error');
    textarea.style.borderColor = '';
}

function showDownloadLink(formattedJson, originalFileName) {
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('formattedFileLink');
    link.href = url;
    link.download = originalFileName.replace('.json', '-format.json');
    link.textContent = originalFileName.replace('.json', '-format.json');
    document.getElementById('downloadLink').style.display = 'block';
}
