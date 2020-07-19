var products;
axios({
    method: 'GET',
    url: '/api/users/products',
}).then((data)=>
{
    products=data.data.data.data;
    products.forEach((product)=>
    {
        const productBox =         
        `<div class="box">
            <div class="text col-md col-md-6">
                <b>${product.name}</b>
                <hr>
                <b>OWNER:</b> 
                <br>
                <b>Stock Available:</b> ${product.stock}
                <br>
                <b>Price per Unit:</b> ${product.price}
                <br>
                <button class="details">Check Details</button>
            </div>
            <div class="col-md col-md-6 image"><img class="food" src="${product.image}"></div>
        </div>`
        document.querySelector('#all').insertAdjacentHTML(
            'afterbegin',
            productBox
        );
    });
});



document.addEventListener('DOMContentLoaded', function () {
    let devfolioOptions = {
        buttonSelector: '#devfolio-apply-now',
        key: 'myhackathonkey',
    }

    let script = document.createElement('script');
    script.src = "https://apply.devfolio.co";
    document.head.append(script);

    script.onload = function () {
        new Devfolio(devfolioOptions);
    }

    script.onerror = function () {
        document.querySelector(devfolioOptions.buttonSelector).addEventListener('click', function () {
            window.location.href = 'https://devfolio.co/external-apply/' + devfolioOptions.key;
        });
    }
});