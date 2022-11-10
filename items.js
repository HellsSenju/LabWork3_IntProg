'use strict'

function addItemToTable(item, price, count) {
    console.info('Try to add item');

    const table = document.querySelector("#tbl-items tbody");
    if (table == null) {
        throw 'Table is not found';
    }

    const linesCount = document.querySelectorAll("#tbl-items tbody tr").length;

    const id = 'item-' + Date.now();
    const tableHtml =
    '<tr id="' + id + '">\
        <th scope="row">' + (linesCount + 1) + '</th>\
        <td>' + item +'</td>\
        <td>' + price.toFixed(2) + '</td>\
        <td>' + count + '</td>\
        <td>' + (price * count).toFixed(2) + '</td>\
        <td><a href=# onclick="removeItemFromTable(\''+ id +'\')"><i class="fa-solid fa-trash"></i></a></td>\
    </tr>';
    table.innerHTML += tableHtml;

    console.info('Added');
}

function removeItemFromTable(id) {
    console.info('Try to remove item');

    if (!confirm('Do you really want to remove this item?')) {
        console.info('Canceled');
        return;
    }

    const item = document.querySelector('#' + id);
    if (item == null) {
        throw 'Item with id [' + id + '] is not found';
    }
    item.remove();

    const numbers = document.querySelectorAll("#tbl-items tbody tr th");
    for (let i = 0; i < numbers.length; i++) {
        numbers[i].innerHTML = i + 1;
    }

    console.info('Removed');
}

document.addEventListener('DOMContentLoaded', function () { 
    console.info('Loaded');

    const form = document.querySelector("#frm-items");
    if (form !== null) {
        form.addEventListener('submit', function(event) {
            console.info('Form onsubmit');
            event.preventDefault();

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

            addItemToTable(item.value, parseFloat(price.value), parseInt(count.value));

            item.value = '';
            price.value = 0;
            count.value = 0;
        });
    }
});