const signup = async(name,password,email,contactNumber,about) => {
    const res = await axios({
        method: 'POST',
        url: '/api/users/signup',
        data: {
            name,
            password,
            email,
            contactNumber,
            about
        },
    })

    if(res.data.status === 'success'){
        location.assign('/')
    }
    else
    {
        location.assign ('/error')
    }
}

document.getElementById("signup-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    var name          = document.querySelector(".name").value;
    var password      = document.querySelector(".password").value;
    var email         = document.querySelector(".email").value;
    var contactNumber = document.querySelector(".contactNumber").value;
    var about         = document.querySelector(".about").value;
    var prof          = document.querySelector(".prof").value;
    signup(name,password,email,contactNumber,about,prof);
});
