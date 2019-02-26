var listOfCards = [];

function item(cardNo, date, cvv, type) {
    this.cardNumber = cardNo;
    this.expiryDate = date;
    this.cvv = cvv;
    this.type = type
};

function cardApi() {
    const Http = new XMLHttpRequest();
    const url = 'http://api.myjson.com/bins/fvzpp';
    Http.open('GET', url);
    Http.send();

    Http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            localStorage.setItem('cardInfo', Http.response)
        }
    }
}

window.onload = function () {
    if (localStorage.getItem('cardInfo') == undefined || localStorage.getItem('cardInfo') == null)
        cardApi();
    console.log("card list", localStorage.getItem("cardList"));
    listOfCards = localStorage.getItem("cardList") ? JSON.parse(localStorage.getItem("cardList")) : [];
    if (listOfCards.length > 0) {
        for (var i = 0; i < listOfCards.length; i++) {
            addListItem(listOfCards[i]);
        }
    }
    else {
        document.getElementById("cardItem").style = "display : none"
    }
}

var item = {
    cardNumber: '',
    expiryDate: new Date,
    cvv: '',
    type: ''
}

var cvvLength = 0;
var cardNoLength = 0;
var cardInfo = JSON.parse(localStorage.getItem('cardInfo'));
var cardNumber = 0;
var cardType = '';

function handleCardNo() {
    checkCardType(document.getElementById('cardNo').value);
}

function checkCardType(value) {
    if (value != '') {
        for (data in cardInfo) {
            if (value.match(cardInfo[data].cardPattern.slice(1, -1))) {
                cardType = cardInfo[data].displayText;
                cvvLength = cardInfo[data].cvvLength;
                cardNoLength = cardInfo[data].cardNumberLength;
                document.getElementById("type").innerHTML = cardType;
            }
        }
    }
    else {
        document.getElementById("type").innerHTML = '';
        cardType = '';
    }
}

function submit() {
    if (cardType !== '') {
        if (document.getElementById('cardNo').value.length != cardNoLength) {
            document.getElementById("error").innerHTML = "Not a valid card number"
        }
        if (document.getElementById('cardNo').value == "") {
            document.getElementById("error").innerHTML = "This a required field"
        }
        else {
            var item = {
                cardNumber: '',
                expiryDate: new Date,
                cvv: '',
                type: ''
            }
            item.cardNumber = document.getElementById('cardNo').value;
            item.expiryDate = document.getElementById('eDate').value;
            item.cvv = document.getElementById('cvv').value;
            item.type = cardType;
            listOfCards.push(item);
            if (listOfCards.length == 1)
                document.getElementById("cardItem").style = "display : block";
            localStorage.setItem("cardList", JSON.stringify(listOfCards));
            document.getElementById('cardNo').value = '';
            document.getElementById('eDate').value = '';
            document.getElementById('cvv').value = '';
            document.getElementById("type").innerHTML = '';
            addListItem(item);
        }
    }
    else {
        alert("Invalid card number")
    }
}

function addListItem(item) {
    var ul = document.getElementById("cardItem");
    var li = document.createElement("li");
    var div1 = document.createElement("div");
    var div2 = document.createElement("div");
    var div2 = document.createElement("div");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var span3 = document.createElement("span");

    //for the first div
    var deleteButton = document.createElement("button")
    var updateButton = document.createElement("button")

    /**onclick event cannot be assigned a string, instead a function
     * alternative button.click = justFunctionName
     */
    deleteButton.onclick = function () { deleteCard(item.cvv); };
    deleteButton.innerHTML = 'Delete'
    updateButton.onclick = function () { updateCard(item.cvv); };;
    updateButton.innerHTML = 'Update'
    span1.style = "float : right"
    span1.appendChild(deleteButton);
    span1.appendChild(updateButton)
    div1.className = "actions";
    div1.appendChild(span1);

    //for the second div
    span2.style = "text-align: left; border : 1px solid lightgray; text-align: center";
    span2.innerHTML += item.type;
    span3.style = "padding-left : 60px";
    span3.innerHTML += item.cardNumber;
    div2.className = "content";
    div2.appendChild(span2);
    div2.appendChild(span3);

    li.className = "eachCard";
    li.setAttribute('id', item.cvv);
    li.appendChild(div1);
    li.appendChild(document.createElement('br'));
    li.appendChild(div2);
    ul.appendChild(li);
}

function deleteCard(cvv) {
    listOfCards = listOfCards.filter(card => {
        card.cvv != cvv;
    });
    localStorage.setItem("cardList", JSON.stringify(listOfCards));

    var list = document.getElementById("cardItem");
    if (list.hasChildNodes()) {
        i = 0;
        for (node in list.childNodes) {
            if (list.childNodes[node].id == cvv) {
                list.removeChild(list.childNodes[i]);
                if (listOfCards.length == 1)
                    document.getElementById("cardItem").style = "display : block";
                break;
            }
            else
                i++;
        }
    }
}

function updateCard(cvv) {
    console.log("in update card");

}

/**
 *  addListItem(item) old code
 * document.getElementById("cardItem").innerHTML +=
        '<li class="eachCard" >' +
        '<div class="actions">' +
        '<span style="float:right">' +
        '<button onclick="deleteCard()">edit</button>' +
        '<button>delete</button>' +
        '</span>' +
        '</div>' +
        '<br />' +
        '<div class="content">' +
        '<span style="text-align: left; border : 1px solid lightgray; text-align: center">' +
        item.type +
        '</span>' +
        '<span style="padding-left : 60px">' +
        item.cardNumber +
        '</span>' +
        '</div>' +
        '</li>';
 */