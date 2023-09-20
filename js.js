// ==UserScript==
// @name        Aliexpress Product ID Extractor
// @namespace   Violentmonkey Scripts
// @match       https://www.aliexpress.com/*
// @grant       none
// @version     1.7
// @description Extract product IDs from Aliexpress and send them to a server
// @author      GPT-4
// @downloadURL none
// ==/UserScript==

(function () {
    'use strict';

    // Create a container to hold all buttons
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '10000';
    container.style.padding = '10px';
    container.style.backgroundColor = '#333';
    container.style.borderRadius = '5px';
    container.style.color = '#fff';
    document.body.appendChild(container);

    // Create a button to send and save product IDs
    var sendButton = document.createElement('input');
    sendButton.type = 'button';
    sendButton.value = 'Send and Save Product IDs';
    sendButton.style.backgroundColor = '#333';
    sendButton.style.margin = '10px';
    sendButton.style.color = 'white';
    container.appendChild(sendButton);
    container.appendChild(document.createElement('br')); // New line

    // Create a button to clear saved product IDs
    var clearButton = document.createElement('input');
    clearButton.type = 'button';
    clearButton.value = 'Clear Product IDs';
    clearButton.style.backgroundColor = '#333';
    clearButton.style.margin = '10px';
    clearButton.style.color = 'white';
    container.appendChild(clearButton);
    container.appendChild(document.createElement('br')); // New line

    // Create a button to export saved product IDs
    var exportButton = document.createElement('input');
    exportButton.type = 'button';
    exportButton.value = 'Export Product IDs';
    exportButton.style.backgroundColor = '#333';
    exportButton.style.margin = '10px';
    exportButton.style.color = 'white';
    container.appendChild(exportButton);
    container.appendChild(document.createElement('br')); // New line

    // Create a counter to show the number of saved product IDs
    var counter = document.createElement('div');
    counter.style.marginTop = '10px';
    container.appendChild(counter);
    container.appendChild(document.createElement('br')); // New line

    // Create a notification element
    var notification = document.createElement('div');
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

    // Helper function to show a notification
    function showNotification(message) {
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(function () {
            notification.style.display = 'none';
        }, 3000);
    }

    // Initialize saved product IDs from localStorage
    var productIds = JSON.parse(localStorage.getItem('productIds')) || [];
    var sendedProductIds = JSON.parse(localStorage.getItem('sendedProductIds')) || [];


    // Update the counter
    counter.innerText = 'Saved Product IDs: ' + productIds.length;

    // Function to extract product IDs from the current page
    function extractProductIds() {
        var links = document.querySelectorAll('a');
        links.forEach(function (link) {
            var href = link.href;
            var match = href.match(/(\d{10,})/);
            if (match) {
                var productId = match[1];
                if (productIds.indexOf(productId) === -1) {
                    productIds.push(productId);
                    sendedProductIds.push(productId);
                }
            }
        });
        localStorage.setItem('productIds', JSON.stringify(productIds));
        localStorage.setItem('sendedProductIds', JSON.stringify(sendedProductIds));
        counter.innerText = 'Saved Product IDs: ' + productIds.length;
    }

    // Function to send product IDs to the server
    function sendProductIds() {
        extractProductIds();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://10.1.1.100:7210/product/from-tamper-monkey', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    showNotification('Product IDs sent successfully!');
                } else {
                    showNotification('Error sending product IDs: ' + xhr.statusText);
                }
            }
        };
        xhr.send(JSON.stringify({ ids: sendedProductIds }));
        sendedProductIds = [];
        localStorage.setItem('sendedProductIds', JSON.stringify(sendedProductIds));
    }

    function clearProductIds() {
        productIds = [];
        localStorage.setItem('productIds', JSON.stringify(productIds));
        counter.innerText = 'Saved Product IDs: ' + productIds.length;
        showNotification('Saved Product IDs cleared!');
    }

    // Function to export saved product IDs
    function exportProductIds() {
        var blob = new Blob([productIds.join('\n')], { type: 'text/csv' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'product_ids.csv';
        link.click();
    }

    // Add event listeners
    sendButton.addEventListener('click', sendProductIds);
    clearButton.addEventListener('click', clearProductIds);
    exportButton.addEventListener('click', exportProductIds);
})();
