const taskForm = document.querySelector('.task');
const list = document.querySelector('.list');
const inputbutton = document.querySelector('.input-button');

let items = [];

function handleSubmit(e) {
    e.preventDefault();
    console.log('submitted!!');
    const name = e.currentTarget.item.value;
    if (!name) return;
    const item = {
        name,
        id: Date.now(),
        complete: false,
        urgent: false,
    };
    if (inputbutton.classList.contains('clicked') === true) {
        item.urgent = true;
    }
    items.push(item);
    console.log(`There are now ${items.length} items in your state`);
    e.target.reset();
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    console.log(items);
    const html = items.sort((a, b) => {
        return b.urgent - a.urgent;
    }).map(item => `<li class="shopping-item">
    <div class="checkbox-container">
    <label class="container" for="myCheckboxId">
    <input
        class="checkbox"
        value="${item.id}"
        type="checkbox"
        ${item.complete && 'checked'}
        id="myCheckboxId"
    >
    <div class="checkbox-box" id="${item.id}"></div>
    </label>
    <span class="itemName">${item.name}</span>
    </div>
    <div class="circle-container">
    <span
    class="circle ${item.urgent && `urgent`}"
    ></span>
    <button
        class="remove-button"
        aria-label="Remove ${item.name}"
        value="${item.id}"
    >&times;</button>
    </div>
    </li>`
    )
    .join('');
    list.innerHTML = html;
}

function mirrorToLocalStorage() {
    console.info('Saving items to local storage');
    localStorage.setItem('items', JSON.stringify(items));
    }

    function restoreFromLocalStorage() {
        console.info('Restoring from LS');
        const lsItems = JSON.parse(localStorage.getItem('items'));
        if (lsItems.length) {
            items = lsItems;
            list.dispatchEvent(new CustomEvent('itemsUpdated'));
        }
    }

    function deleteItem(id) {
        console.log('DELETING ITEM', id);
        items = items.filter(item => item.id !== id);
        console.log(items);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }

    function markAsComplete(id) {
        console.log('Marking as complete', id);
        const itemRef = items.find(item => item.id === id);
        itemRef.complete = !itemRef.complete;
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }

taskForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    console.log(e.target);
    if (e.target.matches('button')) {
        deleteItem(id);
    }
    if (e.target.matches('.checkbox-box')) {
        markAsComplete(parseInt(e.target.id));
    }
});
inputbutton.addEventListener('click', event => {
    event.preventDefault();
    inputbutton.classList.toggle('clicked');
});
restoreFromLocalStorage();