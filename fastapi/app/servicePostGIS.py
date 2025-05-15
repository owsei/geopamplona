import psycopg2
from typing import Optional
from fastapi import HTTPException
from fastapi import FastAPI 
import dbConfig
import dbQuerys

# Funcion de obtencion de datos de tabla espacial
def get_geojson_from_table(table_name: str) -> Optional[dict]:
    query = f"""select  json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
            json_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 25830), 4326))::json,
                'properties', to_jsonb(t) - 'geom'
            )
        )
    ) AS geojson
    from {table_name} t;"""
    print(query)
    result = dbQuerys.select(query)
    if result and result[0]:
        return result[0]
    else:
        return []
    
# Endpoint para obtener tablas de la base de datos
def get_tables_geopamplona() -> Optional[list]:
    query="SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'AND table_type = 'BASE TABLE'"
    print(query)
    result = dbQuerys.selectAll(query)
    return result