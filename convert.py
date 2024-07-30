import csv
import json

input_csv_file = 'data.csv'
output_json_file = 'data.json'

data = []

with open(input_csv_file, mode='r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    for row in csv_reader:
        data.append(row)
        
with open(output_json_file, mode='w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)
    
print(f"Data has been successfully converted to {output_json_file}")
