var services;
axios({
    method: 'GET',
    url: '/api/users/services',
}).then((data)=>
{
    services=data.data.data.data;
    services.forEach((service)=>
    {
        const serviceBox =         
        `<div class="box">
            <div class="text col-md col-md-6">
                <b>${service.name}</b>
                <hr>
                <b>OWNER:</b> 
                <br>
                <b>Rate per hour:</b> ${service.rate}
                <br>
                <button class="details">Check Details</button>
            </div>
            <div class="col-md col-md-6 image"><img class="food" src="${service.image}"></div>
        </div>`
        document.querySelector('#all').insertAdjacentHTML(
            'afterbegin',
            serviceBox
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