import psycopg2
import sys
import csv
from cleanse_stations import valid_stations

con = None

test_station = "1611347_2020"
test_table_name = "_" + test_station

def upload_station_csv(table_name, station):
    try:

        con = psycopg2.connect(database='testdb', user='postgres', password='dataBoi')

        cur = con.cursor()
        cur.execute(f"""
        CREATE TABLE {table_name} (
            date_time char(21),
            water_level char(7),
            type char(1)
        );
        """)

        file_name = f"./csvs/tide_predictions/{station}.csv"

        sql_insert = f"""INSERT INTO {table_name}(date_time, water_level, type)
                VALUES(%s, %s, %s)
                """
        
        with open(file_name, 'r') as f:
            reader = csv.reader(f)
            next(reader) # This skips the 1st row which is the header.
            for record in reader:
                cur.execute(sql_insert, record)
                con.commit()

        con.commit()

    except psycopg2.DatabaseError as e:

        print(f'Error {e}')
        
    finally:

        if con:
            con.close()

# upload_station_csv(test_table_name, test_station)

def select_from_station(table_name):
    try:

        con = psycopg2.connect(database='testdb', user='postgres', password='dataBoi')

        cur = con.cursor()
        cur.execute(f"SELECT * FROM {table_name}")

        table = cur.fetchall()
        print(table[0:2])

    except psycopg2.DatabaseError as e:

        print(f'Error {e}')
        sys.exit(1)

    finally:

        if con:
            con.close()

# select_from_station(test_table_name)

#valid stations imported from valid_stations.py -- 
stations_to_upload = valid_stations

num_csvs = (len(valid_stations))
count_csvs = 0

print(f"uploading {num_csvs} csv(s)")
for _id in stations_to_upload:
    count_csvs += 1
    idx = stations_to_upload.index(_id)
    station = stations_to_upload[idx] + "_2020"
    table = "_" + station
    print(f"uploading csv {count_csvs} of {num_csvs}")
    upload_station_csv(table, station)

print(f"csv(s) upload complete")