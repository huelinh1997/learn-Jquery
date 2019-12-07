
// data
(function () {
    function User(id, checked = false, name, address, password, code, email, username) {
        this.id = id;
        this.checked = checked;
        this.name = name;
        this.address = address;
        this.password = password;
        this.code = code;
        this.email = email;
        this.username = username;
    }

    User.prototype.toggle = function () {
        this.checked = !this.checked;
    }

    function UserList() {
        this.list = [];
    }

    UserList.prototype.addUser = function (user) {
        this.list.push(user)
        return this.list;
    }

    UserList.prototype.removeUser = function(id) {
       for(let i = 0; i < this.list.length; i++) {
           console.log(this.list[i].id, '=', id,this.list[i].id == id)
           if(this.list[i].id == id) {
               this.list.splice(i, 1);
           }
       }
    }

    UserList.prototype.setDataToLocalStorage = function() {
        localStorage.setItem('listUser', JSON.stringify(this.list));
    }

    UserList.prototype.getdatafromLocalStorage = function() {
        let dataString = localStorage.getItem('listUser');
        if(dataString) {
            this.list = JSON.parse(dataString)
        } else this.list = [];
        return this.list;
    }

    UserList.prototype.deleteUser = function () {
        for(let i = this.list.length - 1; i >= 0; i--) {
            if(this.list[i].checked) {
                this.list.splice(i, 1);
                break;
            }
        }
        return this.list;
    }

    UserList.prototype.editUser = function (name, address, password, code, email, username ) {
        for(let user of this.list) {
            if(user.checked) {
                if(name.trim() !== user.name) {
                    console.log('result',name.trim() !== user.name);
                    user.name = name;
                }
                if(address.trim() !== user.address) {
                    user.address = address.trim();
                }
                if(password.trim() !== user.password) {
                    user.name = password.trim();
                }
                if(code.trim() !== user.code) {
                    user.code = code.trim();
                }
                if(email.trim() !== user.email) {
                    user.email = email.trim();
                }
                if(username.trim() !== user.username) {
                    user.username = username.trim();
                }
            }
        }
        return this.list;
    }

    window.User = User;
    window.UserList = UserList;
})();

$(document).ready(function () {
    let tbody = $('#tbody');
    let addBtn = $('#add');
    let saveBtn = $('#save');
    let deleteBtn = $('#delete');
    let editBtn = $('#edit');
    let exitBtn = $('#exit');

    let listUser = new UserList();
    listUser.getdatafromLocalStorage();
    console.log(listUser.list);

    renderAll();
    // validate form
    $('#form_user').validate({
        rules: {
            name: {
                required: true,
                minlength: 6,
            },
            code: {
                required: true,
                minlength: 4
            },
            email: {
                required: true,
                validateEmail: true
            }
        },
        messages: {
            name: {
                required: "Please enter name of user!",
                minlength: "Name must be greater than 5 character!"
            },
            code: {
                required: "Please enter code of user!",
                minlength: "Code must be greater than 3 character!"
            },
            email: {
                required: "Please enter email of user!",
                validateEmail: "You have entered an invalid email address!"
            }
        }
    });
    jQuery.validator.addMethod('validateEmail', function (email) {
        let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    });

    //
    addBtn.click(function() {
        // get all the inputs
        let user = new User();
        user.id = new Date().getTime();
        user.name = $('#name').val().trim();
        user.address = $('#address').val().trim();
        user.password = $('#password').val().trim();
        user.code = $('#code').val().trim();
        user.email = $('#email').val().trim();
        user.username = $('#username').val().trim();

        // remove user edited
        listUser.removeUser(deleteUserExist());
        // add new user
        listUser.addUser(user);
        // set data to local storage
        listUser.setDataToLocalStorage();
        // render user
        render(user);
        // reset form
        $('#form_user').trigger("reset");
        // alert message
        alert('Add user successfully!')

    });

   deleteBtn.click(function () {
       listUser.deleteUser();
       listUser.setDataToLocalStorage();
       deleteUser()
   });

   editBtn.click(function () {
       editUser(listUser.list);
   });
    
    exitBtn.click(function () {
        showUser();
        $('#form_user').trigger("reset");
    })

    function initStatus(object) {
     $(listUser.list).each(function (index,elemnt) {
         console.log(elemnt);
         console.log(index);
         elemnt.checked = false;
     })
   }

    function render(object) {
        let content = `<tr data-target="${object.id}">
                         <td><input type="radio" name="type" id="${object.id}"></td>
                         <td>${object.code}</td>
                         <td>${object.name}</td>
                         <td>${object.address}</td>
                         <td>${object.email}</td>
                         <td>${object.username}</td>
                      </tr>`;
        tbody.append(content);
        initStatus();
        listUser.setDataToLocalStorage();
        $(`#${object.id}`).change(function () {
            initStatus();
            object.checked = !object.checked;
           listUser.setDataToLocalStorage();
        });

    }

    function deleteUserExist(){
       let list = $('tr');
        for(let i = 0; i < list.length; i++) {
            if(!$(list[i]).is(':visible')) {
                let id = list[i].dataset.target;
                list[i].remove()
                return id;
            }
        }
    }

    function renderAll() {
       listUser.list.forEach(item => render(item))
    }

    function deleteUser() {
        let tr = tbody.children();
        for(let i = tr.length - 1; i >= 0; i--) {
            if(tr[i].children[0].children[0].checked) {
                tr[i].remove()
            }
        }
    }

    function hideUser() {
        $('input:checked').parent().parent().hide();
    }

    function showUser() {
        $('input:checked').parent().parent().show();
    }

    function editUser(arr) {
        for(let i = 0; i<arr.length; i++) {
            if(arr[i].checked) {
                $('#name').val(arr[i].name);
                $('#address').val(arr[i].address);
                $('#password').val(arr[i].password);
                $('#code').val(arr[i].code);
                $('#email').val(arr[i].email);
                $('#username').val(arr[i].username);
                $('#name').focus();
                hideUser();
                break;
            }
        }
    }

});


