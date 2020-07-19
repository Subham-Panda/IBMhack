const product = async (name,price,stock,image) => {
    console.log("Product testing")
    const res = await axios({
        method: 'POST',
        url: '/api/users/product',
        data: {
            name,
            price,
            stock,
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


document.getElementById("item-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    const itemName          = document.querySelector(".name").value;
    const itemPrice         = document.querySelector(".price").value;
    const itemStock         = document.querySelector(".stock").value;
    const itemImage         = document.querySelector(".image").value;
    product(itemName,itemPrice,itemStock,itemImage);
    
});
