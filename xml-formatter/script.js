/**
 * Copyright (c) 2025 https://json-formatter.app
 * Released under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// script.js
const translations = {
    en: {
        inputTitle: "Input XML Text",
        uploadTitle: "Upload XML File",
        outputTitle: "Formatted XML Text",
        formatXmlButton: "Format XML",
        uploadXmlButton: "Upload and Format",
        copyButton: "Copy to Clipboard",
        downloadText: "Download formatted file:",
        invalidXml: "Invalid XML file",
        copied: "Copied to clipboard!",
        copyFailed: "Copy failed!",
        noFileSelected: "No file selected",
        chooseFile: "Choose File",
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
    document.getElementById('formatXmlButton').textContent = translations[lang].formatXmlButton;
    document.getElementById('uploadXmlButton').textContent = translations[lang].uploadXmlButton;
    document.getElementById('copyButton').textContent = translations[lang].copyButton;
    document.getElementById('downloadText').textContent = translations[lang].downloadText;
    document.getElementById('fileStatus').textContent = translations[lang].noFileSelected;
    document.getElementById('fileLabel').textContent = translations[lang].chooseFile;
}

document.getElementById('formatXmlButton').addEventListener('click', formatXml);

function formatXml() {
    const inputText = document.getElementById('inputXml').value;
    validateAndFormatXml(inputText);
}

function validateAndFormatXml(inputText) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(inputText, "text/xml"); // 确保使用正确的MIME类型

        // check for parsing errors
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            throw new Error("Invalid XML input: " + parseError[0].textContent);
        }

        const serializer = new XMLSerializer();
        const formattedXml = serializer.serializeToString(xmlDoc);

        // 使用 vkbeautify 格式化
        document.getElementById('outputXml').textContent = vkbeautify.xml(formattedXml, 2); // 第二个参数是缩进级别
        document.getElementById('inputXml').classList.remove('error'); // 移除错误样式
    } catch (error) {
        document.getElementById('inputXml').classList.add('error'); // 添加错误样式
        alert(error.message || translations[document.getElementById('language').value].invalidXml);
    }
}

// 注意，最好在适当的位置调用formatXml函数以应对可能的自动格式化触发事件
document.getElementById('inputXml').addEventListener('input', formatXml);

