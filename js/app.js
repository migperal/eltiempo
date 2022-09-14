window.addEventListener('load', () => {
    //API KEY user -> https://openweathermap.org/
    let key = `dcac364762a18f23f4c650207578925f`

    //Botón para detectar ubicación usuario
    let btnUbicacion = document.getElementById('btn-ubicacion')
    btnUbicacion.addEventListener('click', () => {
        miUbicacion()
    })

    //Geolocalizar ubicación usuario
    const miUbicacion = () => {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(posicionActual => {
                    let lon, lat
                    lon = posicionActual.coords.longitude
                    lat = posicionActual.coords.latitude
                    // const url = `https://api.openweathermap.org/data/2.5/forecast?q=barcelona&appid=${key}`
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=${key}`
                    buscaUbicacion(url)
                }) 
              
        } else {
            alert("El navegador no soporta la geolocalización")
        }
    }

    //Eventos
    let btnBusqueda = document.getElementById('btn-search') 
    btnBusqueda.addEventListener('click', () => {
        buscaUbicacion(inputUrl())
    })  
    addEventListener ('keydown', (e) => {
        if (e.key === "Enter") {
            buscaUbicacion(inputUrl())
        }
    }) 

    // Obtención de búsqueda y salida url
    const inputUrl = () => {
        let input = document.getElementById('search').value
        if (input.length>0) {
            input = input + ', ES'
        } 
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&lang=es&units=metric&appid=${key}`
        document.getElementById('search').value = ''
        return url
    }
    
    //Resultado de URL
    const buscaUbicacion = (url) => {

        let tempValor = document.getElementById('temp-valor')
        let icono = document.getElementById('icono-animado')
        let tempDescr = document.getElementById('temp-descripcion')
        let ubicacion = document.getElementById('ubicacion')

        fetch(url)
            .then(response => { return response.json() })
            .then(datos => {

                //console.log(datos)

                if(datos.cod == '400') {
                    Swal.fire({
                        icon: 'error',
                        text: 'Debes introducir una ciudad',
                    })

                } else if (datos.cod == '404') {
                    Swal.fire({
                        icon: 'error',
                        text: 'No existe la ciudad en España',
                    })
                } else {
                    //console.log(datos.list)
                    tempValor.textContent = `${Math.round(datos.main.temp)} ºC`
                    tempDescr.textContent = datos.weather[0].description
                    ubicacion.textContent = datos.name   

                    //icon move -> https://www.amcharts.com/free-animated-svg-weather-icons/
                    switch (datos.weather[0].main) {
                        case 'Thunderstorm':
                        icono.src='img/animated/thunder.svg'
                        break;
                        case 'Drizzle':
                        icono.src='img/animated/rainy-2.svg'
                        break;
                        case 'Rain':
                        icono.src='img/animated/rainy-7.svg'
                        break;
                        case 'Snow':
                        icono.src='img/animated/snowy-6.svg'
                        break;                        
                        case 'Clear':
                            icono.src='img/animated/day.svg'
                        break;
                        case 'Atmosphere':
                        icono.src='img/animated/weather.svg'
                            break;  
                        case 'Clouds':
                            icono.src='img/animated/cloudy-day-1.svg'
                            break;  
                        default:
                        icono.src='img/animated/cloudy-day-1.svg'
                        console.log('por defecto'); 
                    } 

                    eliminarDatosSecundarios()
                    crearDatosSecundarios()
                    insertarDatosSecundarios(datos.main.feels_like,datos.main.humidity,datos.wind.speed,datos.main.pressure)
                    runClock()
                }
            })
            .catch(e => {
                console.log(e)
            })
    }     

    //fecha actual.
    const runClock = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const fullYear = date.getFullYear();
        const fecha = document.getElementById('fecha');
        fecha.innerHTML = `${day}/${month}/${fullYear}`;
    };

    // Crear cajas para mostrar datos secundarios.
    const crearDatosSecundarios = () => {
        let box = document.getElementById('datos-2nd')
        let div = document.createElement('div')
        div.classList.add('datos-secundarios')
        
        // Crear caja datos-secundarios
        if (box.hasChildNodes()) {
            for (let i = 0; i < box.childNodes.length; i++) {
                if (box.childNodes[i].nodeType == 1) {
                    box.childNodes[i].appendChild(div.cloneNode(true))
                }
            }
            // Crear apartados datos-secundarios
            let boxDatosSecundarios = document.querySelectorAll('.datos-secundarios')
            let h6 = document.createElement('h6')
            let p = document.createElement('p')
            for (let i = 0; i < boxDatosSecundarios.length; i++) {
                boxDatosSecundarios[i].appendChild(h6.cloneNode(true));
                boxDatosSecundarios[i].appendChild(p.cloneNode(true));
            }
        }
    }

    // Eliminar cajas existentes datos secundarios.
    const eliminarDatosSecundarios = () => {
        let div = document.querySelectorAll('.datos-secundarios');
        if (div.length > 0) {
            for (let i = 0; i < div.length; i++) {
                div[i].parentNode.removeChild(div[i])
            }
        }
    }

    // Insertar datos secundarios
    const insertarDatosSecundarios = (sensacion, humedad, velocidad, presion) => {
        let boxDatosSecundarios = document.querySelectorAll('.datos-secundarios')
        boxDatosSecundarios[0].firstChild.textContent = "Sensación térmica"
        boxDatosSecundarios[0].lastChild.textContent = Math.round(sensacion) + " ºC"
        boxDatosSecundarios[1].firstChild.textContent = "Humedad relativa"
        boxDatosSecundarios[1].lastChild.textContent = humedad + " %"
        boxDatosSecundarios[2].firstChild.textContent = "Velocidad del viento"
        boxDatosSecundarios[2].lastChild.textContent = velocidad + " m/s"
        boxDatosSecundarios[3].firstChild.textContent = "Presión"
        boxDatosSecundarios[3].lastChild.textContent = presion + " mb"
    }
})