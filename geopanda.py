import geopandas as gpd

# Lee el archivo .shp
gdf = gpd.read_file("geopamplonamaps/AMBI_Pto_Inst_FV_Muni/AMBI_Pto_Inst_FV_Muni.shp")

# Exporta a GeoJSON
gdf.to_file("fotovoltaica.geojson", driver="GeoJSON")