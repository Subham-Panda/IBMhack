const service = async (name,rate,image) => {
    console.log("Service testing")
    const res = await axios({
        method: 'POST',
        url: '/api/users/service',
        data: {
            name,
            rate,
            image
        },
    })
    if(res.data.status === 'success'){
        console.log("Redirecting to homepage")
        location.assign('/')
    }
    else
    {
        console.log("Redirecting to homepage")
        location.assign ('/error')
    }
}


document.getElementById("service-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    const serviceName           = document.querySelector(".name").value;
    const serviceRate           = document.querySelector(".rate").value;
    const serviceImage          = document.querySelector(".image").value;
    console.log(serviceName,serviceRate);
    service(serviceName,serviceRate,serviceImage);
});
