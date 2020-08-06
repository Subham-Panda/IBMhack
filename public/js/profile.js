axios({
    method: 'GET',
    url: '/api/users/me',
}).then((data)=>
{
    info=data.data.data.data;
    const name = `${info.name}`;
    const prof = info.profession;
    const about = info.about;
    const ph = info.contactNumber;
    const email = info.email;
    const products = info.products;
    const dp = info.image;
    products.forEach((product)=>
    {
        axios({
            method: 'GET',
            url: `/api/users/product/${product}`,
        }).then((data2) =>
        { 
            console.log(data2)
            const ImageBox =         
            `<img class="stock col-md-3" src="${data2.data.data.data.image}">`
        document.querySelector('.image-row').insertAdjacentHTML(
            'afterbegin',
            ImageBox
        )})
    })
    const ImageBox =         
            `<img src="${dp}" class="man">`
        document.querySelector('.dp').insertAdjacentHTML(
            'afterbegin',
            ImageBox
        );
        document.querySelector('.heading2').insertAdjacentHTML(
            'afterbegin',
            prof
        );
        document.querySelector('.prof').insertAdjacentHTML(
            'afterbegin',
            about
        );
        document.querySelector('.ph').insertAdjacentHTML(
            'afterbegin',
            ph
        );
        document.querySelector('.email').insertAdjacentHTML(
            'afterbegin',
            email
        );
        const order =`<a href="/order/${info._id}>ORDER</a>"`
        document.querySelector('.order').insertAdjacentHTML(
            'afterbegin',
            email
        );
});
