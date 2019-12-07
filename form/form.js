

$(document).ready(function () {
    function User(id, username, password, email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
    }
    User.prototype.setDataToLocalStorage = function (user) {
        localStorage.setItem(`${this.username}`, JSON.stringify(user));
    }
    // validate form
    $('#register').validate({
        rules: {
            usernameReg: {
                required: true,
            },
            passwordReg: {
                required: true,
                minlength: 4
            },
            passwordConfirm: {
                required: true,
                equalTo: '#passwordReg'
            },
            email: {
                required: true,
                validateEmail: true
            }

        },
        messages: {
            usernameReg: {
                required: "Please enter username of user!",
            },
            passwordReg: {
                required: "Please enter password of user!",
                minlength: "Password must be greater than 3 character!"
            },
            passwordConfirm: {
                required: "Please enter password confirm of user!",
                equalTo: "Password confirm must be equal to password!"
            },
            email: {
                required: "Please enter email of user!",
                validateEmail: "You have entered an invalid email address!"
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault();
            let newUser = new User();
            newUser.id = new Date().getTime();
            newUser.username = $('#usernameReg').val().trim();
            newUser.password = $('#passwordReg').val().trim();
            newUser.email = $('#email').val().trim();

            newUser.setDataToLocalStorage(newUser);
            alert('Register success!');
            form.submit();
        }
    })
    jQuery.validator.addMethod('validateEmail', function (email) {
        let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    });

    $('#login').validate({
        rules: {
            username: {
                required: true,
            },
            password: {
                required: true,
                minlength: 4
            }
        },
        messages: {
            usernameReg: {
                required: "Please enter username of user!",
            },
            password: {
                required: "Please enter password of user!",
                minlength: "Password must be greater than 3 character!"
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault();
            let username = $('#username').val().trim();
            let password = $('#password').val().trim();

            let dataString = JSON.parse(localStorage.getItem(`${username}`));
            if(dataString === null) {
                alert('The username does not exist!');
                $('#username').focus();
            } else  {
                if(dataString.password == `${password}`) {
                    alert('Login success!');
                    form.submit();
                }
                else {
                    alert('Password invalid!');
                    $('#password').focus();
                }
            }

        }
    })
})

