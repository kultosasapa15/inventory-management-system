/* =====================================
   LOGIN AND SIGN UP
   ===================================== */


/* Show Sign Up */

function showSignup() {

    document.getElementById("loginForm").style.display = "none";

    document.getElementById("signupForm").style.display = "block";
}


/* Show Login */

function showLogin() {

    document.getElementById("loginForm").style.display = "block";

    document.getElementById("signupForm").style.display = "none";
}


/* Sign Up */

function signup() {

    var username =
        document.getElementById("signupUsername").value;

    var password =
        document.getElementById("signupPassword").value;

    var confirmPassword =
        document.getElementById("signupConfirm").value;


    if (username == "" || password == "") {

        document.getElementById("signupMessage").innerHTML =
            "Please fill in all fields.";

        return;
    }


    if (password != confirmPassword) {

        document.getElementById("signupMessage").innerHTML =
            "Passwords do not match.";

        return;
    }


    var users =
        JSON.parse(localStorage.getItem("users")) || [];


    /* Check if username already exists */

    for (var i = 0; i < users.length; i++) {

        if (users[i].username == username) {

            document.getElementById("signupMessage").innerHTML =
                "Username already exists.";

            return;
        }
    }


    var newUser = {

        username: username,

        password: password

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    document.getElementById("signupMessage").style.color =
        "green";

    document.getElementById("signupMessage").innerHTML =
        "Account created successfully!";


    document.getElementById("signupUsername").value = "";

    document.getElementById("signupPassword").value = "";

    document.getElementById("signupConfirm").value = "";
}


/* Login */

function login() {

    var username =
        document.getElementById("loginUsername").value;

    var password =
        document.getElementById("loginPassword").value;


    var users =
        JSON.parse(localStorage.getItem("users")) || [];


    var correctUser = false;


    for (var i = 0; i < users.length; i++) {

        if (
            users[i].username == username &&
            users[i].password == password
        ) {

            correctUser = true;

            break;
        }
    }


    if (correctUser == true) {

        localStorage.setItem("loggedIn", "true");

        localStorage.setItem("currentUser", username);

        window.location.href = "dashboard.html";

    } else {

        document.getElementById("loginMessage").innerHTML =
            "Incorrect username or password.";
    }
}


/* Logout */

function logout() {

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
}


/* =====================================
   INVENTORY
   ===================================== */


/* Get Inventory */

function getInventory() {

    return JSON.parse(
        localStorage.getItem("inventory")
    ) || [];
}


/* Save Inventory */

function saveInventory(inventory) {

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );
}


/* Variable used when editing */

var editingID = -1;


/* Add or Edit Product */

function saveProduct() {

    var name =
        document.getElementById("productName").value;

    var quantity =
        document.getElementById("productQuantity").value;

    var price =
        document.getElementById("productPrice").value;


    if (name == "" || quantity == "" || price == "") {

        document.getElementById("inventoryMessage").innerHTML =
            "Please fill in all fields.";

        return;
    }


    var inventory = getInventory();


    /* EDIT PRODUCT */

    if (editingID != -1) {

        for (var i = 0; i < inventory.length; i++) {

            if (inventory[i].id == editingID) {

                inventory[i].name = name;

                inventory[i].quantity =
                    Number(quantity);

                inventory[i].price =
                    Number(price);

                break;
            }
        }

        editingID = -1;

        document.getElementById("formTitle").innerHTML =
            "Add Product";

        document.getElementById("cancelButton").style.display =
            "none";

    }


    /* ADD PRODUCT */

    else {

        var newProduct = {

            id: Date.now(),

            name: name,

            quantity: Number(quantity),

            price: Number(price)

        };


        inventory.push(newProduct);
    }


    saveInventory(inventory);


    document.getElementById("productName").value = "";

    document.getElementById("productQuantity").value = "";

    document.getElementById("productPrice").value = "";


    document.getElementById("inventoryMessage").style.color =
        "green";

    document.getElementById("inventoryMessage").innerHTML =
        "Product saved successfully!";


    displayInventory();
}


/* Display Inventory */

function displayInventory() {

    var inventory = getInventory();

    var table =
        document.getElementById("inventoryTable");


    if (!table) {
        return;
    }


    var search =
        document.getElementById("searchProduct").value
        .toLowerCase();


    table.innerHTML = "";


    for (var i = 0; i < inventory.length; i++) {

        var product = inventory[i];


        if (
            product.name.toLowerCase().includes(search)
        ) {


            var status = "";

            var statusClass = "";


            if (product.quantity <= 5) {

                status = "Low Stock";

                statusClass = "low-stock";

            } else {

                status = "Available";

                statusClass = "good-stock";
            }


            var row =
                "<tr>" +

                "<td>" + (i + 1) + "</td>" +

                "<td>" + product.name + "</td>" +

                "<td>" + product.quantity + "</td>" +

                "<td>₱" + product.price.toFixed(2) + "</td>" +

                "<td class='" + statusClass + "'>" +
                status +
                "</td>" +

                "<td>" +

                "<button class='edit-button' " +
                "onclick='editProduct(" +
                product.id +
                ")'>Edit</button> " +

                "<button class='delete-button' " +
                "onclick='deleteProduct(" +
                product.id +
                ")'>Delete</button>" +

                "</td>" +

                "</tr>";


            table.innerHTML += row;
        }
    }
}


/* Load Inventory */

function loadInventory() {

    displayInventory();
}


/* Edit Product */

function editProduct(id) {

    var inventory = getInventory();


    for (var i = 0; i < inventory.length; i++) {

        if (inventory[i].id == id) {

            document.getElementById("productName").value =
                inventory[i].name;

            document.getElementById("productQuantity").value =
                inventory[i].quantity;

            document.getElementById("productPrice").value =
                inventory[i].price;


            editingID = id;


            document.getElementById("formTitle").innerHTML =
                "Edit Product";


            document.getElementById("cancelButton").style.display =
                "inline-block";


            window.scrollTo(0, 0);

            break;
        }
    }
}


/* Cancel Edit */

function cancelEdit() {

    editingID = -1;


    document.getElementById("productName").value = "";

    document.getElementById("productQuantity").value = "";

    document.getElementById("productPrice").value = "";


    document.getElementById("formTitle").innerHTML =
        "Add Product";


    document.getElementById("cancelButton").style.display =
        "none";
}


/* Delete Product */

function deleteProduct(id) {

    var answer =
        confirm("Are you sure you want to delete this product?");


    if (answer == true) {

        var inventory = getInventory();


        var newInventory = [];


        for (var i = 0; i < inventory.length; i++) {

            if (inventory[i].id != id) {

                newInventory.push(inventory[i]);
            }
        }


        saveInventory(newInventory);


        displayInventory();
    }
}


/* =====================================
   DASHBOARD
   ===================================== */

function loadDashboard() {

    var inventory = getInventory();


    var totalProducts =
        inventory.length;


    var totalStock = 0;

    var lowStock = 0;


    for (var i = 0; i < inventory.length; i++) {

        totalStock +=
            inventory[i].quantity;


        if (inventory[i].quantity <= 5) {

            lowStock++;
        }
    }


    document.getElementById("totalProducts").innerHTML =
        totalProducts;


    document.getElementById("totalStock").innerHTML =
        totalStock;


    document.getElementById("lowStock").innerHTML =
        lowStock;
}


/* =====================================
   STORE INFORMATION
   ===================================== */


/* Load Store Information */

function loadStoreInfo() {

    var store =
        JSON.parse(
            localStorage.getItem("store")
        );


    if (store == null) {
        return;
    }


    document.getElementById("storeName").value =
        store.name;

    document.getElementById("storeID").value =
        store.id;

    document.getElementById("ownerName").value =
        store.owner;

    document.getElementById("storeAddress").value =
        store.address;

    document.getElementById("storeContact").value =
        store.contact;
}


/* Save Store Information */

function saveStoreInfo() {

    var store = {

        name:
            document.getElementById("storeName").value,

        id:
            document.getElementById("storeID").value,

        owner:
            document.getElementById("ownerName").value,

        address:
            document.getElementById("storeAddress").value,

        contact:
            document.getElementById("storeContact").value

    };


    if (
        store.name == "" ||
        store.id == "" ||
        store.owner == ""
    ) {

        document.getElementById("storeMessage").innerHTML =
            "Please fill in the required information.";

        return;
    }


    localStorage.setItem(
        "store",
        JSON.stringify(store)
    );


    document.getElementById("storeMessage").style.color =
        "green";


    document.getElementById("storeMessage").innerHTML =
        "Store information saved successfully!";
}
