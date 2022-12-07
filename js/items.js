'use strict'

Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

const items = new Map(); //словарь

class ItemLine {
    constructor(name, price, count, sum) {
        this.name = name;
        this.price = parseFloat(price).toFixed(2);
        this.count = parseInt(count);
        this.sum = parseFloat(sum).toFixed(2);
    }

    static createFrom(item) {
        return new ItemLine(item.name, item.price, item.count, item.sum);
    }
}

function loadItemsTable() {
    console.info('Try to load data');

    function drawItemsTable() {
        console.info('Try to draw table');

        const table = document.querySelector("#tbl-items tbody");
        if (table == null) {
            throw 'Table is not found';
        }

        fetch("handlebars/items-table.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const template = Handlebars.compile(html);
                table.innerHTML = template({ 'items': Object.fromEntries(items.entries()) });
                console.info('Drawn');
            })
            .catch(function (error) {
                console.info('ERROR IN: fetch("handlebars/items-table.html")');
                throw "Can't render template";
            });
    }


    fetch("http://localhost:8079/lines")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.info('Loaded');
            items.clear();
            for (let i = 0; i < data.length; i++) {
                const current = data[i];
                items.set(current.id, ItemLine.createFrom(current));
            }
            drawItemsTable();
        })
        .catch(function (error) {
            console.error(error);
            throw "Can't load items";
        });
}

function addItemToTable(item, price, count) {
    console.info('Try to add item');

    const itemObject = new ItemLine(item, price, count, price * count);

    fetch("http://localhost:8079/lines", 
        { 
            method: 'POST', 
            body: JSON.stringify(itemObject),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.info('Added');
            console.log(data);
            
            loadItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't add item";
        });
}

function removeItemFromTable(id) {
    console.info('Try to remove item');

    if (!confirm('Do you really want to remove this item?')) {
        console.info('Canceled');
        return;
    }

    if (!items.has(id)) {
        throw 'Item with id [' + id + '] is not found';
    }

    fetch("http://localhost:8079/lines/" + id,
        {
            method: 'DELETE'
        })
        .then(function () {
            console.info('Removed');

            loadItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't add item";
        });
}

function renameItem(id) {
    console.info('Try to edit item');
    
    if (!confirm('Do you really want to edit this item?')) {
        console.info('Canceled');
        return;
    }
    
    if (!items.has(id)) {
        throw 'Item with id [' + id + '] is not found';
    }

    const item = document.querySelector("#item");
    if (item == null) {
        throw 'Item control is not found';
    }
    
    const price = document.querySelector("#price");
    if (price == null) {
        throw 'Price control is not found';
    }
    
    const count = document.querySelector("#count");
    if (count == null) {
        throw 'Count control is not found';
    }
    
    const itemObject = new ItemLine(item.value, parseFloat(price.value), parseInt(count.value), parseFloat(price.value*count.value));
    
    fetch("http://localhost:8079/lines/" + id,
        {
            method: 'PUT',
            body: JSON.stringify(itemObject),
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        })
        .then(function () {
            console.info('Edited');
            
            loadItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't add item";
        });
}


function loadItemsSelect(select) {
    function drawItemsSelect(select, data) {
        fetch("handlebars/items-select.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const template = Handlebars.compile(html);
                select.innerHTML += template({ 'items': data });
            })
            .catch(function (error) {
                console.error('Error:', error);
                throw "Can't load items";
            });
    }

    fetch("http://localhost:8079/items")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            drawItemsSelect(select, data);
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't load items";
        });
}

document.addEventListener('DOMContentLoaded', function () {
    console.info('Script Loaded');

    const item = document.querySelector("#item");
    if (item == null) {
        throw 'Item control is not found';
    }

    const price = document.querySelector("#price");
    if (price == null) {
        throw 'Price control is not found';
    }

    const count = document.querySelector("#count");
    if (count == null) {
        throw 'Count control is not found';
    }

    loadItemsSelect(item);
    loadItemsTable();

    const form = document.querySelector("#frm-items");
    if (form !== null) {
        form.addEventListener('submit', function (event) {
            console.info('Form onsubmit');
            event.preventDefault();

            addItemToTable(item.value, price.value, count.value);

            item.value = '';
            price.value = 0;
            count.value = 0;
        });
    }
});