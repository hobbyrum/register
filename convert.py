import pandas as pd

df = pd.read_csv('registry.csv')

df.to_json('registry.json', orient='records')