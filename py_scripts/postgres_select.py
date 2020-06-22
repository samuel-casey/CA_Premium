import psycopg2
import sys

def select_from_station(table_name):

    con = None

    try:

        con = psycopg2.connect(database='tidal_data', user='postgres', password='dataBoi')

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

test_table_name = "station_metadata"

select_from_station(test_table_name)