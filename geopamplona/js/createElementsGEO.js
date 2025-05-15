// import * as serviceGeoPamplona from './serviceGeoPamplona.js';
const url = "http://localhost:8000";

//   FUNCIONES DE CREACION DE ENTIDADES EN EL MAPA
function crearPunto(datosPunto) {
    const coordenadas = datosPunto.geometry.coordinates;
    const [lon, lat] = coordenadas;
    console.log('Coordenadas:', coordenadas);
    console.log('Lat:', lat, 'Lon:', lon);

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 0), // Altura 0 para el terreno
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el punto está en terreno
        disableDepthTestDistance: Number.POSITIVE_INFINITY // Siempre visible encima del terreno
      }
    });
  }

  function crearPoligono(datosPoligono) {
    const coordenadas = datosPoligono.geometry.coordinates[0]; // Asumiendo que es un polígono simple
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat, 0);
    });

    viewer.entities.add({
      polygon: {
        hierarchy: posiciones,
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK
      }
    });
  }

  function crearLinea(datosLinea) {
    const coordenadas = datosLinea.geometry.coordinates;
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat, 0);
    });

    viewer.entities.add({
      polyline: {
        positions: posiciones,
        material: Cesium.Color.BLUE,
        width: 5
      },
      label: {
        text: datosLinea.properties.DIRECCION || 'Sin dirección',
        font: '18pt sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -12),
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el punto está en terreno
        disableDepthTestDistance: Number.POSITIVE_INFINITY // Siempre visible encima del terreno
      }
    });
  }

  function crearMultipoligono(datosMultipoligono) {
    const coordenadas = datosMultipoligono.geometry.coordinates[0][0]; // Asumiendo que es un polígono simple
    const posiciones = coordenadas.map(coord => {
      const [lon, lat] = coord;
      return Cesium.Cartesian3.fromDegrees(lon, lat);
    });

    viewer.entities.add({
      // position : Cesium.Cartesian3.fromDegrees(datosMultipoligono.geometry.coordinates[0][0],0),
      polygon: {
        hierarchy: posiciones,
        material: Cesium.Color.GREEN.withAlpha(0.5),
        // outline: true,
        outlineColor: Cesium.Color.BLACK,
        // height: 10,
        // extrudedHeight: 550,
        
      }
    });
  }

 


  // FUNCION PARA CARGAR UN GEOJSON EN EL VISOR
  // console.log(Cesium.VERSION);
  function cargarGeoJSON(ruta) {

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-1.6456,42.8125, 7000),
    });
      
    // const dataSource = await Cesium.GeoJsonDataSource.load('datos/prueba.geojson', {
    //   clampToGround: true
    // });
    const utm30n = "+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs";
    const wgs84 = proj4.WGS84;
    
    var dataSource;
    fetch(ruta)
      .then(response => response.json())
      .then(data => {
        dataSource= data;


        const entidades = dataSource[0].features;
        // console.log('Entidades:', entidades);
        for (let i = 0; i < entidades.length; i++) {

          switch (entidades[i].geometry.type) {
            case 'Point':
              console.log('Es un punto');
              crearPunto(entidades[i]);
              break;
            case 'Polygon':
              console.log('Es un polígono');
              crearPoligono(entidades[i]);
              break;
            case 'LineString':
              console.log('Es una línea');
              break;
            case 'MultiPolygon':
              console.log('Es un multipolígono');
              crearMultipoligono(entidades[i]);
              break;
            default:
              console.log('Tipo de geometría no soportado');
          }
        }
        console.log('finalizado');
      })
      .catch(error => console.error("Error al leer el GeoJSON:", error));
    }//FIN cargarGeoJSON 

    
  function limpiarEntidades() {
    // Limpiar todas las entidades del visor
    viewer.entities.removeAll();
  }

  function puntoPamplona() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-1.6456,42.8125, 7000),
        // orientation: {
        //     heading: Cesium.Math.toRadians(10.0),
        //     pitch: Cesium.Math.toRadians(-60.0),
        //     roll: 0.0
        // }
      });
  }

  // FUNCION PARA ABRIR O CERRAR UN SUBÁRBOL EN EL MENÚ LATERAL
  function toggleSubtree(element) {
    const subtree = element.nextElementSibling;
    subtree.classList.toggle("active");
  }


  function toggleView() {
    
    if (window.is3D) {
      document.getElementById("map").style.display =  "none" ;
      document.getElementById("cesiumContainer").style.display = "block";
      window.is3D = !window.is3D;
    }
    else
    {
      document.getElementById("map").style.display = "block" ;
      document.getElementById("cesiumContainer").style.display = "none";
      window.is3D = !window.is3D;
    }
    
  }

  function dbStatus(){
    fetch('http://localhost:8000/')
    .then(response => response.json())
    .then(data => console.log("Status de BD:" + data.json()))
    .catch(error => console.error('Error:', error));
  }


  async function getLayersNames() {
    const selectCapas = document.getElementById('capasGeopamplona');
    const urlcapas = url + "/tablesgeopamplona";
    
    fetch(urlcapas)
        .then(response => response.json())
        .then(data => {
            data.forEach(dato => {
              const option = document.createElement('li');
              option.value = dato;
              option.textContent = dato;
              option.addEventListener('click', function() {
                limpiarEntidades();
                const urlGeoJson = url + "/getgeojson/" + dato;
                cargarGeoJSON(urlGeoJson);
              });
              selectCapas.appendChild(option);
            });
          }
    )
    .catch(error => console.error("Error al leer el GeoJSON:", error));
  }


  // dbStatus();
  getLayersNames();
  
  