from typing import Union
from fastapi import FastAPI
from fastapi import HTTPException
import servicePostGIS
import psycopg2
import dbConfig
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/db-status")
def db_status():
    try:
        conn = psycopg2.connect(**dbConfig.DB_CONFIG)
        conn.close()
        return {"status": "PostGIS is connected"}
    except Exception as e:
        return {"status": f"Failed to connect: {e}"}
    

# Endpoint para obtener un GeoJSON de una tabla espacial.
@app.get("/getgeojson/{table_name}")
def get_geojson(table_name: str):
    print (f"Obteniendo GeoJSON de la tabla: {table_name}")
    geojson = servicePostGIS.get_geojson_from_table(table_name)
    if geojson:
        return geojson
    else:
        raise HTTPException(status_code=404, detail="No se encontraron datos o la tabla no existe")
    

@app.get("/tablesgeopamplona")
def get_tables_geopamplona():
    print (f"Obteniendo tablas de la base de datos")
    tables = servicePostGIS.get_tables_geopamplona()
    if tables:
        # print (f"Tablas obtenidas: {tables}")
        # print(tables)
        return tables
    else:
        raise HTTPException(status_code=404, detail="No se encontraron tablas o la base de datos no existe")