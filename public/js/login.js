const login = async(email,password) => {
    const res = await axios({
        method: 'POST',
        url: '/api/users/login',
        data: {
            email,
            password,
        },
    })

    if(res.data.status === 'success'){
        location.assign('/')
    }
    else
    {
        location.assign ('/login')
    }
}

document.getElementById("login-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    var email          = document.querySelector(".email").value;
    var password      = document.querySelector(".password").value;
    login(email,password);
});
