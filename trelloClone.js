import {API_KEY, API_TOKEN, BOARD_ID} from './config.js'

const idBoard = BOARD_ID;
const api = API_KEY;
const token = API_TOKEN;

const url = `https://api.trello.com/1/boards/${idBoard}/lists?cards=all&key=${api}&token=${token}`;
get()
const board = document.getElementById('trello-board');

function get() {
    let result = fetch(url)
        .then(res => res.json())
        .then(data => list(data));
    return result;
}

// show board

function list(data) {
    while (board.hasChildNodes()) {
        board.removeChild(board.firstChild);
    }
    for (let list of data) {
        showlist(list)
    }
    const addListButton = document.createElement('input')
    addListButton.type = 'button';
    addListButton.id = 'add-list';
    addListButton.value = '+ Add another list';
    addListButton.style.height = '20px'

    addListButton.addEventListener('click', showInputList)

    board.appendChild(addListButton)
}

// show input box for new list

function showInputList(e) {

    const parentNode = e.target.parentNode
    const addListBtn = document.getElementById('add-list');
    addListBtn.style.display = 'none';
    const addForm = document.createElement('form');
    const typeList = document.createElement('input');
    const formBtn = document.createElement('button');
    typeList.type = 'text';
    typeList.placeholder = 'enter list title...';
    typeList.id = 'new-list';
    formBtn.appendChild(document.createTextNode('add list'))
    addForm.appendChild(typeList)
    addForm.appendChild(formBtn)
    parentNode.appendChild(addForm)
    formBtn.addEventListener('click', addNewList)
}

// add new list in board

function addNewList(e) {
    e.preventDefault()

    const listname = document.getElementById('new-list').value;

    const addListUrl = `https://api.trello.com/1/lists?name=${listname}&idBoard=${idBoard}&pos=bottom&key=${api}&token=${token}`;

    return fetch(addListUrl, {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            get();
            return res.json();
        }
    })
}

// show list

function showlist(list) {
    // const board = document.getElementById('trello-board');
    const boardlist = document.createElement('div')
    boardlist.className = 'list';
    boardlist.id = list['id'];
    const listname = list['name'];

    boardlist.appendChild(document.createTextNode(listname));

    // update button

    const updatebtn = document.createElement('button')
    updatebtn.className = 'update';
    updatebtn.appendChild(document.createTextNode('u'));

    updatebtn.addEventListener('click', updateList);

    // archieve button

    const archieveBtn = document.createElement('button')
    archieveBtn.className = 'delete';
    archieveBtn.appendChild(document.createTextNode('a'));

    archieveBtn.addEventListener('click', archieveList)

    boardlist.appendChild(updatebtn);
    boardlist.appendChild(archieveBtn);

    board.appendChild(boardlist);

    const cards = list['cards'];
    for (let card of cards) {
        showcard(card)
    }

    // add card button

    const addCardButton = document.createElement('input')
    addCardButton.type = 'button';
    addCardButton.id = 'add-card';
    addCardButton.value = '+ Add another card';
    boardlist.appendChild(addCardButton)

    addCardButton.addEventListener('click', showInputCard)
};

// show input box for new card

function showInputCard(e) {

    let hide = e.target;
    hide.style.display = "none";

    const parentNode = e.target.parentNode
    const addForm = document.createElement('form');
    const typeCard = document.createElement('input');
    const formBtn = document.createElement('button');
    typeCard.type = 'text';
    typeCard.placeholder = 'enter a title for this card...';
    typeCard.id = 'new-card';
    formBtn.appendChild(document.createTextNode('add card'))
    addForm.appendChild(typeCard)
    addForm.appendChild(formBtn)
    parentNode.appendChild(addForm)
    formBtn.addEventListener('click', addNewCard)
}

// add new card

function addNewCard(e) {
    e.preventDefault()

    const cardname = document.getElementById('new-card').value;
    const idList = e.target.parentNode.parentNode.id;

    const addCardUrl = `https://api.trello.com/1/cards?name=${cardname}&idList=${idList}&pos=bottom&key=${api}&token=${token}`;

    return fetch(addCardUrl, {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            get();
            return res.json();
        }
    })
}

// show card

function showcard(card) {
    const boardlist = document.getElementById(card.idList)
    const li = document.createElement('li');
    li.id = card['id'];
    li.className = 'card'
    const cardname = card['name'];

    li.appendChild(document.createTextNode(cardname));

    // update button

    const updatebtn = document.createElement('button')
    updatebtn.className = 'update';
    updatebtn.appendChild(document.createTextNode('u'));
    updatebtn.addEventListener('click', updateCard);

    // delete button

    const deletebtn = document.createElement('button')
    deletebtn.className = 'delete';
    deletebtn.appendChild(document.createTextNode('d'));

    deletebtn.addEventListener('click', deleteCard)

    li.addEventListener('click', popupEvent)

    li.appendChild(updatebtn);
    li.appendChild(deletebtn);

    boardlist.appendChild(li);
};

// update card

function updateCard(e) {
    e.target.style.display = 'none';
    const idCard = e.target.parentNode.id;
    const card = document.getElementById(idCard);
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'new-name';
    const button = document.createElement('button');
    button.appendChild(document.createTextNode('save'));
    card.insertBefore(input, e.target);
    card.insertBefore(button, e.target);
    button.addEventListener('click', changecard)

    function changecard() {

        const cardname = document.getElementById('new-name').value;

        const updateCardUrl = `https://api.trello.com/1/cards/${idCard}?name=${cardname}&key=${api}&token=${token}`;
        return fetch(updateCardUrl, {
            method: "PUT"
        }).then(res => {
            if (res.ok) {
                get();
                return res.json();
            }
        })
    }
}

// delete card

function deleteCard(e) {
    const id = e.target.parentNode.id;
    const deleteCardUrl = `https://api.trello.com/1/cards/${id}?key=${api}&token=${token}`;

    return fetch(deleteCardUrl, {
        method: 'DELETE'
    }).then(res => {
        if (res.ok) {
            get();
            return res.json();
        }
    })
}

// update list 

function updateList(e) {
    const idList = e.target.parentNode.id;
    const list = document.getElementById(idList);
    const input = document.createElement('input');
    const button = document.createElement('button');
    input.type = 'text';
    input.id = 'new-name';
    e.target.style.display = 'none';
    list.insertBefore(input, e.target)
    list.insertBefore(button, e.target)
    button.appendChild(document.createTextNode('save'));
    button.addEventListener('click', changelist)

    function changelist() {
        const listname = document.getElementById('new-name').value;

        updateListUrl = `https://api.trello.com/1/lists/${idList}?name=${listname}&key=${api}&token=${token}`;

        return fetch(updateListUrl, {
            method: 'PUT'
        }).then(res => {
            if (res.ok) {
                get();
                return res.json();
            }
        })
    }
}

// archieve list 

function archieveList(e) {
    const idList = e.target.parentNode.id;

    const archieveListUrl = `https://api.trello.com/1/lists/${idList}/?closed=true&key=${api}&token=${token}`;
    return fetch(archieveListUrl, {
        method: 'PUT'
    }).then(res => {
        if (res.ok) {
            get();
            return res.json();
        }
    })
}

// create checklist 

const popupdiv = document.getElementById('popup');

function popupEvent(e) {
    const cardID = e.target.id;
    getCheckList(cardID)
}
function getCheckList(cardID) {
    popupdiv.style.display = "block";
    popup.style.backgroundColor = "white"

    const churl = `https://api.trello.com/1/cards/${cardID}/checklists?checkItems=all&key=${api}&token=${token}`;

    let result = fetch(churl)
        .then(res => res.json())
        .then(data => checklist(data, cardID));
    return result;
}

function checklist(data, cardID) {
    while (popupdiv.hasChildNodes()) {
        popupdiv.removeChild(popupdiv.firstChild);
    }
    for (let list of data) {
        showchecklist(list)
    }

    // add checklist button

    const addChecklistBtn = document.createElement('input')
    addChecklistBtn.type = 'button';
    addChecklistBtn.id = cardID;
    addChecklistBtn.value = '+ Add another Checklist';
    addChecklistBtn.style.height = '20px'
    addChecklistBtn.addEventListener('click', showInputChecklist)
    popupdiv.appendChild(addChecklistBtn)

    // close button

    const closebtn = document.createElement('button')
    closebtn.appendChild(document.createTextNode('close'))

    closebtn.addEventListener('click', close)
    popupdiv.insertBefore(closebtn, addChecklistBtn)
    function close(e) {
        let hide = e.target.parentNode
        hide.style.display = 'none'
    }
}

window.onclick = function (event) {
    if (event.target == popupdiv) {
        popupdiv.style.display = "none";
    }
}

function showchecklist(task) {
    const checlist = document.getElementById('popup')
    const checkdiv = document.createElement('div')
    const checklistname = task['name'];
    checkdiv.id = task['id']
    checkdiv.className = 'checklist';
    checkdiv.appendChild(document.createTextNode(checklistname))

    // update button

    const updatebtn = document.createElement('button')
    updatebtn.className = 'update';
    updatebtn.appendChild(document.createTextNode('u'));
    updatebtn.addEventListener('click', updateCheckList);

    //delete button

    const deletebtn = document.createElement('button')
    deletebtn.className = 'delete';
    deletebtn.appendChild(document.createTextNode('d'));

    deletebtn.addEventListener('click', deleteCheckList)

    checkdiv.appendChild(updatebtn)
    checkdiv.appendChild(deletebtn)

    checlist.appendChild(checkdiv)

    const items = task['checkItems']
    for (let info of items) {
        showcheckitem(info)
    }

    // add checkitem 

    const addCheckItemBtn = document.createElement('input')
    addCheckItemBtn.type = 'button';
    addCheckItemBtn.id = 'add-checkitem';
    addCheckItemBtn.value = '+ Add another CheckItem';
    checkdiv.appendChild(addCheckItemBtn)

    addCheckItemBtn.addEventListener('click', showInputCheckItem)

}

function showcheckitem(info) {
    const checkdiv = document.getElementById(info['idChecklist'])
    const li = document.createElement('li');
    li.id = info['id'];
    li.className = 'checkitem'
    const checkitemname = info['name'];
    const text = document.createTextNode(checkitemname)

    // create checkbox
    const checkbox = document.createElement('input');
    const status = info['state']
    checkbox.type = 'checkbox';
    checkbox.className = 'check';
    checkbox.addEventListener('change', checkItemStatus);
    if (status === "complete") {
        checkbox.checked = true;
        li.style.textDecoration = "line-through";
    } else {
        checkbox.checked = false;
    }

    function checkItemStatus(e) {
        const idCard = e.target.parentNode.parentNode.parentNode.lastChild.id;
        const idCheckItem = e.target.parentNode.id;
        let state;
        if (e.target.checked) {
            state = "complete"
        } else {
            state = "incomplete"
        }
        const url = `https://api.trello.com/1/cards/${idCard}/checkItem/${idCheckItem}?state=${state}&key=${api}&token=${token}`;

        return fetch(url, {
            method: "PUT"
        }).then(res => {
            if (res.ok) {
                getCheckList(idCard)
                return res.json();
            }
        })
    }

    // update button

    const updatebtn = document.createElement('button')
    updatebtn.className = 'update';
    updatebtn.appendChild(document.createTextNode('u'));
    updatebtn.addEventListener('click', updateCheckItem);

    //delete button

    const deletebtn = document.createElement('button')
    deletebtn.className = 'delete';
    deletebtn.appendChild(document.createTextNode('d'));

    deletebtn.addEventListener('click', deleteCheckItem)

    li.appendChild(checkbox)
    li.appendChild(text)
    li.appendChild(updatebtn)
    li.appendChild(deletebtn)
    checkdiv.appendChild(li)

}

// delete checkitem

function deleteCheckItem(e) {
    const idCheckList = e.target.parentNode.parentNode.id
    const idCheckItem = e.target.parentNode.id;
    const idCard = e.target.parentNode.parentNode.parentNode.id

    const deleteCheckItemUrl = `https://api.trello.com/1/checklists/${idCheckList}/checkItems/${idCheckItem}?key=${api}&token=${token}`;

    return fetch(deleteCheckItemUrl, {
        method: "DELETE"
    }).then(res => {
        if (res.ok) {
            getCheckList(idCard);
            return res.json();
        }
    })
}

// delete checklist

function deleteCheckList(e) {
    const idList = e.target.parentNode.id;
    const idCard = e.target.parentNode.parentNode.lastChild.id
    const deleteCheckListUrl = `https://api.trello.com/1/checklists/${idList}/?key=${api}&token=${token}`;
    return fetch(deleteCheckListUrl, {
        method: 'DELETE'
    }).then(res => {
        if (res.ok) {
            getCheckList(idCard);
            return res.json();
        }
    })
}


// update checkitem

function updateCheckItem(e) {
    e.target.style.display = 'none'
    // const idCheckList = e.target.parentNode.parentNode.id
    const idCheckItem = e.target.parentNode.id;
    // console.log(e.target.parentNode)

    const card = document.getElementById(idCheckItem);
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'new-name';
    const button = document.createElement('button');
    button.appendChild(document.createTextNode('save'));
    card.insertBefore(input, e.target);
    card.insertBefore(button, e.target);
    button.addEventListener('click', changeCheckItemName)

    const idCard = card.parentNode.parentNode.lastChild.id;

    function changeCheckItemName() {

        const checkItemName = document.getElementById('new-name').value;

        const updateCheckItemUrl = `https://api.trello.com/1/cards/${idCard}/checkItem/${idCheckItem}?name=${checkItemName}&key=${api}&token=${token}`;

        return fetch(updateCheckItemUrl, {
            method: 'PUT'
        }).then(res => {
            if (res.ok) {
                getCheckList(idCard)
                return res.json();
            }
        })
    }
}

// update checklist

function updateCheckList(e) {
    e.target.style.display = 'none';
    const idCheckList = e.target.parentNode.id
    const idCard = e.target.parentNode.parentNode.id
    const card = document.getElementById(idCheckList);
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'new-name';
    const button = document.createElement('button');
    button.appendChild(document.createTextNode('save'));
    card.insertBefore(input, e.target);
    card.insertBefore(button, e.target);
    button.addEventListener('click', changeChecklistName)
    function changeChecklistName() {
        const checklistName = document.getElementById('new-name').value;
        const updateCheckListUrl = `https://api.trello.com/1/checklists/${idCheckList}/?name=${checklistName}&key=${api}&token=${token}`;

        return fetch(updateCheckListUrl, {
            method: 'PUT'
        }).then(res => {
            if (res.ok) {
                getCheckList(idCard)
                return res.json();
            }
        })
    }
}

// show input box for new checklist

function showInputChecklist(e) {
    e.preventDefault()
    let hide = e.target;
    hide.style.display = "none";

    const parentNode = e.target.parentNode;
    const addForm = document.createElement('form');
    const typeChecklist = document.createElement('input');
    const formBtn = document.createElement('button');
    typeChecklist.type = 'text';
    typeChecklist.placeholder = 'enter a title for this checklist...';
    typeChecklist.id = 'new-checklist';
    formBtn.appendChild(document.createTextNode('add checklist'))
    addForm.appendChild(typeChecklist)
    addForm.appendChild(formBtn)
    parentNode.appendChild(addForm)
    formBtn.addEventListener('click', addNewChecklist)

    const idCard = e.target.id;

    // add new checklist

    function addNewChecklist() {
        e.preventDefault()
        const checklistName = document.getElementById('new-checklist').value;

        const addChecklistUrl = `https://api.trello.com/1/checklists?name=${checklistName}&idCard=${idCard}&key=${api}&token=${token}`
        return fetch(addChecklistUrl, {
            method: "POST"
        }).then(res => {
            if (res.ok) {
                getCheckList(idCard)
                return res.json();
            }
        })
    }
}

// add checkitem

function showInputCheckItem(e) {

    let hide = e.target;
    hide.style.display = "none";

    const parentNode = e.target.parentNode;
    const addForm = document.createElement('form');
    const typeCheckItem = document.createElement('input');
    const formBtn = document.createElement('button');

    typeCheckItem.type = 'text';
    typeCheckItem.placeholder = 'enter a title for this checkItem...';
    typeCheckItem.id = 'new-checkItem';

    formBtn.appendChild(document.createTextNode('add checkItem'))

    addForm.appendChild(typeCheckItem)
    addForm.appendChild(formBtn)

    parentNode.appendChild(addForm)
    formBtn.addEventListener('click', addNewCheckItem)
}

function addNewCheckItem(e) {
    e.preventDefault()

    const checkItemName = document.getElementById('new-checkItem').value;
    const idList = e.target.parentNode.parentNode.id;
    const idCard = e.target.parentNode.parentNode.parentNode.id;

    const addCheckItemUrl = `https://api.trello.com/1/checklists/${idList}/checkItems?name=${checkItemName}&pos=bottom&checked=false&key=${api}&token=${token}`

    return fetch(addCheckItemUrl, {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            getCheckList(idCard)
            return res.json()
        }
    })
}
