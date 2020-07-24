const order = async (name,quantity) => {
    console.log("Order testing")
    var url = window.location.pathname;
    var getQuery = url.split('/')[2];
    console.log(getQuery);
    const res = await axios({
        method: 'POST',
        url: `/api/users/order/${getQuery}`,
        data: {
            name,
            quantity
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


document.getElementById("order-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    const orderName          = document.querySelector(".name").value;
    const orderQuantity      = document.querySelector(".quantity").value;
    console.log(orderName,orderQuantity);
    order(orderName,orderQuantity);
    
});
