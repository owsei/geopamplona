import psycopg2
from typing import Optional
from fastapi import HTTPException
from fastapi import FastAPI 
import dbConfig


def select(query: str) -> Optional[tuple]:
    try:
        conn = psycopg2.connect(**dbConfig.DB_CONFIG)
        with conn.cursor() as cur:
            cur.execute(query)
            result = cur.fetchall()
        if result :
            return result
        else:
            return None
    except Exception as e:
        print(f"Error al ejecutar la consulta: {e}")
        return None
    
def selectAll(query: str) -> Optional[tuple]:
    try:
        print("llego aqui")
        conn = psycopg2.connect(**dbConfig.DB_CONFIG)
        with conn.cursor() as cur:
            cur.execute(query)
            result =[fila[0] for fila in cur.fetchall()]
        if result :
            # print(result)
            return result
        else:
            return None
    except Exception as e:
        print(f"Error al ejecutar la consulta: {e}")
        return None