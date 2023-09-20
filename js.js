// ==UserScript==
// @name         Aliexpress Product ID Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract product IDs from Aliexpress search page
// @author       ChatGPT
// @match        https://www.aliexpress.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Variables to store product IDs
    let productIds = JSON.parse(localStorage.getItem("productIds") || "[]");

    // Create a container to hold all buttons
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '10000';
    container.style.padding = '10px';
    container.style.backgroundColor = '#333';
    container.style.borderRadius = '5px';
    container.style.color = '#fff';
    document.body.appendChild(container);

    const sendAndAddButton = document.createElement('input');
    sendAndAddButton.type = 'button';
    sendAndAddButton.value = 'Send & Add Product IDs';
    sendAndAddButton.style.backgroundColor = '#333';
    sendAndAddButton.style.margin = '10px';
    sendAndAddButton.style.color = 'white';
    container.appendChild(sendAndAddButton);

    const exportButton = document.createElement('input');
    exportButton.type = 'button';
    exportButton.value = 'Export Product IDs';
    exportButton.style.backgroundColor = '#333';
    exportButton.style.margin = '10px';
    exportButton.style.color = 'white';
    container.appendChild(exportButton);

    const clearButton = document.createElement('input');
    clearButton.type = 'button';
    clearButton.value = 'Clear Product IDs';
    clearButton.style.backgroundColor = '#333';
    clearButton.style.margin = '10px';
    clearButton.style.color = 'white';
    container.appendChild(clearButton);

    const counter = document.createElement('div');
    counter.textContent = `Count: ${productIds.length}`;
    container.appendChild(counter);

    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '180px';
    notification.style.right = '10px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '10001';
    notification.style.display = 'none';
    document.body.appendChild(notification);

    const showNotification = (message) => {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    };

    sendAndAddButton.addEventListener('click', () => {
        const currentProductIds = Array.from(document.querySelectorAll('[data-product-id]'))
            .map(el => parseInt(el.getAttribute('data-product-id')));

        if (currentProductIds.length === 0) {
            showNotification("No product IDs found!");
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://10.1.1.100:7210/product/from-tamper-monkey",
            data: JSON.stringify({
                "ids": currentProductIds
            }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: (response) => {
                if (response.status === 200) {
                    showNotification("Product IDs sent successfully!");
                    productIds = productIds.concat(currentProductIds);
                    localStorage.setItem("productIds", JSON.stringify(productIds));
                    counter.textContent = `Count: ${productIds.length}`;
                } else {
                    showNotification("Failed to send product IDs!");
                }
            }
        });
    });

    exportButton.addEventListener('click', () => {
        const blob = new Blob([productIds.join('\n')], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'productIds.txt';

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    });

    clearButton.addEventListener('click', () => {
        productIds = [];
        localStorage.setItem("productIds", "[]");
        counter.textContent = `Count: ${productIds.length}`;
        showNotification("Product IDs cleared!");
    });
})();
