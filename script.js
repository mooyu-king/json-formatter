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
        noFileSelected: "未选择文件", // 文件未选择状态文本
        chooseFile: "选择文件", // 选择文件文本
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
        noFileSelected: "No file selected", // 文件未选择状态文本
        chooseFile: "Choose File", // 选择文件文本
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
        noFileSelected: "لم يتم اختيار ملف", // 文件未选择状态文本
        chooseFile: "اختر ملف", // 选择文件文本
    }
};

// 设置语言选择的事件监听
document.getElementById('language').addEventListener('change', function() {
    const lang = this.value;
    updateLanguage(lang);
});

// 初始化默认语言为英语
updateLanguage('en');

// 更新页面语言
function updateLanguage(lang) {
    document.getElementById('inputTitle').textContent = translations[lang].inputTitle;
    document.getElementById('uploadTitle').textContent = translations[lang].uploadTitle;
    document.getElementById('outputTitle').textContent = translations[lang].outputTitle;
    document.getElementById('formatJsonButton').textContent = translations[lang].formatJsonButton;
    document.getElementById('uploadJsonButton').textContent = translations[lang].uploadJsonButton;
    document.getElementById('copyButton').textContent = translations[lang].copyButton;
    document.getElementById('downloadText').textContent = translations[lang].downloadText;
    document.getElementById('fileStatus').textContent = translations[lang].noFileSelected; // 更新文件状态文本
    document.getElementById('fileLabel').textContent = translations[lang].chooseFile; // 更新选择文件文本
}

// 处理按钮和输入框的逻辑
document.getElementById('formatJsonButton').addEventListener('click', formatJson);
document.getElementById('inputJson').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // 阻止换行
        formatJson();
    }
});

document.getElementById('jsonFile').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : '';
    document.getElementById('fileStatus').textContent = fileName ? fileName : translations[document.getElementById('language').value].noFileSelected; // 更新文件状态
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
        alert(translations[document.getElementById('language').value].noFileSelected); // 提示未选择文件
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
        document.getElementById('inputJson').classList.remove('error'); // 移除错误样式
        clearErrorHighlight();
        if (fileName) {
            showDownloadLink(formattedJson, fileName);
        }
    } catch (error) {
        document.getElementById('inputJson').classList.add('error'); // 添加错误样式
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

            // 设置光标到出错位置
            const textarea = document.getElementById('inputJson');
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length); // 将光标移至文本末尾
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
                textarea.style.borderColor = ''; // 清除光标闪烁
                alert(translations[document.getElementById('language').value].invalidJson); // 提示无效文件
            }
        } else {
            clearInterval(interval);
        }
    }, 500);
}

function clearErrorHighlight() {
    const textarea = document.getElementById('inputJson');
    textarea.classList.remove('error');
    textarea.style.borderColor = ''; // 重置边框颜色
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
